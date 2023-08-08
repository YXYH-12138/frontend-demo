import { InjectionKey } from "vue";

export interface TabsProps {
	label: string;
	name: string;
}

export interface Context {
	tabs: TabsProps[];
	active: string;
}

export const tabContextKey: InjectionKey<Context> = Symbol();
