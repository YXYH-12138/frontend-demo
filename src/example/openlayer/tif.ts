import { fromArrayBuffer } from "geotiff";
import { max } from "xe-utils";
import chroma from "chroma-js";
import { ImageStatic } from "ol/source";
import proj4 from "proj4";
import { Projection, transformExtent } from "ol/proj";
import { register } from "ol/proj/proj4";

// 定义投影
proj4.defs(
	"EPSG:4549",
	"+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
);
register(proj4);
// const EPSG4549 = new Projection({
// 	code: "EPSG:4549",
// 	units: "m",
// 	extent: [119.97, 0, 120.00000000000003, 500000],
// 	worldExtent: [119.97, 0, 120.00000000000003, 500000]
// });

// 获取tif图转化后的源
export async function getTifSource(res: any) {
	const tiff = await fromArrayBuffer(res);
	const image = await tiff.getImage();
	const data = await (image.readRasters({ interleave: true }) as any);
	// const { [0]: raster, width, height } = data;
	console.log(data);
	getTifColorValues(data);
	// const colorValues = getTifColorValues(raster);
	// // canvas范畴
	// const imageData = new ImageData(new Uint8ClampedArray(colorValues.buffer), width, height);
	// const canvas = document.createElement("canvas");
	// canvas.width = width;
	// canvas.height = height;
	// const context = canvas.getContext("2d")!;
	// // 抗锯齿, 提升图片质量
	// context.imageSmoothingEnabled = true;
	// context.imageSmoothingQuality = "high";
	// // 将图像数据放到画布上
	// context.putImageData(imageData, 0, 0);
	// // canvas生成图片地址
	// const imageStaticUrl = canvas.toDataURL("image/png");

	// // 创建tif图源
	// const tifSource = new ImageStatic({
	// 	url: imageStaticUrl,
	// 	imageExtent: transformExtent(image.getBoundingBox(), "EPSG:4549", "EPSG:3857")
	// });
	// return tifSource;
}

// 获取tif图对应的颜色
function getTifColorValues(raster: any) {
	// 这个的数组长度乘以4, 是为了与图片着色对应，分为: r, g, b, a
	const colorValues = new Uint8Array(raster.length * 4);
	console.log(colorValues);
	const maxNum = max(raster, (v: number) => v) as number;
	const colorScale = chroma
		.scale([
			"#ff0000",
			"#ff0000",
			"#ff5400",
			"#ffaa00",
			"#ffff00",
			"#aaff00",
			"#ffffff",
			"#ffffff",
			"#00ff54",
			"#00ffa9",
			"#00ffff",
			"#00aaff",
			"#0055ff",
			"#0000ff"
		])
		.domain([-0.3, -0.25, -0.2, -0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35]);
	// 判断着色(这里需要根据等值色来判断赋值)
	for (let i = 0; i < raster.length; i++) {
		let value = raster[i] as number;
		if (value === -9999 || !value) continue; // 未知情况
		if (value > maxNum) value = maxNum; // 极大情况
		const color = colorScale(value).rgb();
		colorValues[i * 4] = color[0];
		colorValues[i * 4 + 1] = color[1];
		colorValues[i * 4 + 2] = color[2];
		colorValues[i * 4 + 3] = 255;
	}
	return colorValues;
}
