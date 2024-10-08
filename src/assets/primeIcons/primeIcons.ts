import { PrimeIcons } from 'primeng/api';

export const primeIcons: {icon:string}[] = [];

for (const prop in PrimeIcons) {
  if (Object.prototype.hasOwnProperty.call(PrimeIcons, prop)) {
    primeIcons.push({icon:PrimeIcons[prop as keyof PrimeIcons]});
  }
}
