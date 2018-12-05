import exponent from "./exponent";

//  todo：晦涩的实现
export default function(step, value) {
  return Math.max(
    0,
    Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 -
      exponent(Math.abs(step))
  );
}
