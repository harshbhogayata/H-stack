import { charge } from './pay.js';
export function refund(c) { return charge(-c); }
