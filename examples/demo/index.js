import { value as defaultValue } from './default';
import { name } from './parent';

const dy = () => import('./log');

export function logA() {
	console.log('function logA called', name, defaultValue);
}

export function logB() {
	console.log('function logB called');
}

setTimeout(() => {
	dy();
});
