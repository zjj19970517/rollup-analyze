import { sayName } from './child';

const dy = () => import('./log');

export const name = 'parent';

sayName();

setTimeout(() => {
	dy();
});
