/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as Cesium from "cesium";
import type { Polygon, FeatureCollection, Position } from "geojson";
import createPropertyDescriptor from "./createPropertyDescriptor";

export function diffDataSources(
	oldSource: Cesium.GeoJsonDataSource,
	newSource: Cesium.GeoJsonDataSource
) {
	const oldEntities = oldSource.entities.values;
	const newEntities = newSource.entities.values;

	// const oldPositions: Cesium.Cartesian3[][] = [];

	const oldMap = new Map<string, Cesium.Entity>();
	for (const oldEntity of oldEntities) {
		oldMap.set(oldEntity.properties!.getValue(Cesium.JulianDate.now()).id as string, oldEntity);
		// 获取顶点坐标数组（Cartesian3 数组）
		// const positions = oldEntity.polygon!.hierarchy!.getValue(Cesium.JulianDate.now()).positions;
		// oldPositions.push(positions);
	}

	const addArray: Cesium.Entity[] = [];
	const removeArray: Cesium.Entity[] = [];
	const updateArray: Cesium.Entity[] = [];

	for (const newEntity of newEntities) {
		const valData = newEntity.properties!.getValue(Cesium.JulianDate.now());
		const id = valData.id as string;
		const depth = valData["WATER DEPT"];

		if (oldMap.has(id)) {
			const oldEntity = oldMap.get(id)!;
			const oldDepth = oldEntity.properties!.getValue(Cesium.JulianDate.now())["WATER DEPT"];
			// 判断水深是否有变化
			if (hasChanged(oldDepth, depth)) {
				updateArray.push(oldEntity);
			}
			oldMap.delete(id);
		} else {
			addArray.push(newEntity);
			oldMap.delete(id);
		}
	}
	// 处理删除的实体
	for (const oldEntity of oldMap.values()) {
		removeArray.push(oldEntity);
	}

	return { addArray, removeArray, updateArray: updateArray };
}

export function diffEntities(oldSource: Cesium.Entity[], newSource: Cesium.Entity[]) {
	const oldEntities = oldSource.values();
	const newEntities = newSource.values();

	const oldMap = new Map<string, Cesium.Entity>();
	for (const oldEntity of oldEntities) {
		oldMap.set(oldEntity.properties!.getValue(Cesium.JulianDate.now()).id as string, oldEntity);
	}

	const addArray: Cesium.Entity[] = [];
	const removeArray: Cesium.Entity[] = [];
	const updateArray: Cesium.Entity[] = [];

	for (const newEntity of newEntities) {
		const valData = newEntity.properties!.getValue(Cesium.JulianDate.now());
		const id = valData.id as string;
		const color = valData["color"];

		if (oldMap.has(id)) {
			const oldEntity = oldMap.get(id)!;
			const oldColor = oldEntity.properties!.getValue(Cesium.JulianDate.now())["color"];
			// 判断水深是否有变化
			if (hasChanged(color, oldColor)) {
				updateArray.push(oldEntity);
			}
			oldMap.delete(id);
		} else {
			addArray.push(newEntity);
			oldMap.delete(id);
		}
	}
	// 处理删除的实体
	for (const oldEntity of oldMap.values()) {
		removeArray.push(oldEntity);
	}

	oldMap.clear();

	return { addArray, removeArray, updateArray };
}

function hasChanged(oldDepth: number, newDepth: number) {
	return oldDepth !== newDepth;
}

export function appendId(geojson: FeatureCollection<Polygon>) {
	const oldLen = geojson.features.length;
	for (let i = 0; i < oldLen; i++) {
		const oldFeature = geojson.features[i];
		const { coordinates } = oldFeature.geometry;
		const oldId = createId(coordinates);
		oldFeature.properties!.id = oldId;
	}
}

function createId(coordinates: Position[][]) {
	const coords = coordinates.flat();
	return coords.join(",");
}

// export function diffGeojson(
// 	oldGeojson: FeatureCollection<Polygon>,
// 	newGeojson: FeatureCollection<Polygon>
// ) {
// 	if (!oldGeojson) return;
// 	console.log(newGeojson);
// }

interface FlowMaterialOptions {
	color: Cesium.Color;
}
const timeScratch = new Cesium.JulianDate();
export class FlowMaterial {
	private _color: any;
	color: Cesium.Color;

	_definitionChanged: Cesium.Event<(...args: any[]) => void>;
	get definitionChanged() {
		return this._definitionChanged;
	}

	constructor({ color }: FlowMaterialOptions) {
		Object.defineProperties(this, {
			// isConstant: {
			// 	get: function () {
			// 		// @ts-ignore;
			// 		return Cesium.Property.isConstant(this._color);
			// 	}
			// },
			// definitionChanged: {
			// 	get: function () {
			// 		return this._definitionChanged;
			// 	}
			// },
			color: createPropertyDescriptor("color")
		});

		this._definitionChanged = new Cesium.Event();
		this.color = color;
	}

	equals(other?: Cesium.Property) {
		return (
			// @ts-ignore;
			this === other ||
			// @ts-ignore;
			(other instanceof FlowMaterial && Cesium.Property.equals(this._color, other._color))
		);
	}

	get isConstant() {
		// @ts-ignore;
		return Cesium.Property.isConstant(this._color);
	}

	getType() {
		return "FlowMaterial";
	}

	getValue(time: Cesium.JulianDate, result?: any): any {
		if (!Cesium.defined(time)) {
			time = Cesium.JulianDate.now(timeScratch);
		}
		if (!Cesium.defined(result)) {
			result = {};
		}

		result.color = getValueOrClonedDefault(
			(this as any)._color,
			time,
			Cesium.Color.WHITE,
			result.color
		);

		return result;
	}
}

// @ts-ignore;
Cesium.Material._materialCache.addMaterial("FlowMaterial", {
	fabric: {
		type: "FlowMaterial",
		uniforms: {
			color: new Cesium.Color(1.0, 0.0, 0.0, 0.5), // 初始颜色：红色
			time: 0 // 时间变量
		},
		components: {
			diffuse: "mix(color.rgb, vec3(1.0, 1.0, 1.0), abs(sin(time * 3.141592653589793)))",
			alpha: "color.a"
		}
	},
	translucent: function (material) {
		return material.uniforms.color.alpha < 1.0;
	}
});

function getValueOrClonedDefault(property: any, time: any, valueDefault: any, result: any) {
	let value: any;
	if (Cesium.defined(property)) {
		value = property.getValue(time, result);
	}
	if (!Cesium.defined(value)) {
		value = valueDefault.clone(value);
	}
	return value;
}
