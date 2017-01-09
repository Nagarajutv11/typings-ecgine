export class Menu{
	name: string
	command?: string
	submenus?: Menu[]
}

export interface MenuCommand{
	():void;
}

export interface Callback{
	():void;
}

export interface Supplier<T>{
	():T;
}