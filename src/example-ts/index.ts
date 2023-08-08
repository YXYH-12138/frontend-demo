/**
 * 协变： 允许子类型转换为父类型
 * 逆变： 允许父类型转换为子类型(函数参数)
 * 在类型系统中，属性更多的类型是子类型。
 * 在集合论中，属性更少的集合是子集。
 */
// 在老版本的 TS 中，函数参数是双向协变的。也就是说，既可以协变又可以逆变，但是这并不是类型安全的。
// 在新版本 TS (2.6+) 中 ，你可以通过开启 strictFunctionTypes 或 strict 来修复这个问题。设置之后，函数参数就不再是双向协变的了。

interface Animal {
	age: number;
}

interface Dog extends Animal {
	bark(): void;
}

let animal!: Animal;
let dog!: Dog;

// 函数参数是逆变的
let AnimalFn!: (animal: Animal) => Dog;
let DogFn!: (dog: Dog) => Dog;

/**
 * 把 AnimalFn 赋值给 DogFn，可以理解为在 DogFn 里面肯定是可以调用 AnimalFn 中的属性的
 */
DogFn = AnimalFn;

DogFn = (arg: Dog) => {
	const dog = AnimalFn(arg);
	dog.age;
	return dog;
};

// AnimalFn = DogFn

// AnimalFn = (arg: Animal) => {
//   const dog = DogFn(arg);
//   dog.age
//   return dog
// }

// dog = animal

let foo1!: (a: string) => void;
let foo2!: (a: string, b: string) => void;

// foo1 = foo2
// foo2 = foo1;

function handler(arg: string) {
	// ....
}

function doSomething(callback: (arg1: string, arg2: number) => void) {
	callback("hello", 42);
}

doSomething(handler);
