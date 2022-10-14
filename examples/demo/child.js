import { value as defaultValue } from './default';

export const name = 'child';

export function sayName() {
	console.log('name', name, defaultValue);
	return name;
}
