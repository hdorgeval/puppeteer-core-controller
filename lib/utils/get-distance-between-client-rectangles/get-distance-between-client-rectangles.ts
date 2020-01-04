export function getDistanceBetweenClientRectangles(rect1: ClientRect, rect2: ClientRect): number {
  const x1 = rect1.left + rect1.width / 2;
  const y1 = rect1.top + rect1.height / 2;
  const centerPosition1 = Math.sqrt(x1 * x1 + y1 * y1);

  const x2 = rect2.left + rect2.width / 2;
  const y2 = rect2.top + rect2.height / 2;
  const centerPosition2 = Math.sqrt(x2 * x2 + y2 * y2);

  const distance = Math.abs(centerPosition1 - centerPosition2);
  return distance;
}
