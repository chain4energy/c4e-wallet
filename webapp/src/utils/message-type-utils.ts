//TODO: add tests
export function getElementFromMessageType(messageType:string, elementPosition: number){
  const elements = messageType.replace(/^\//, "").split(".");
  if (elementPosition >= 0 && elementPosition < elements.length) {
    return elements[elementPosition];
  }
  return null; // Zwracamy null, jeśli indeks jest poza zakresem
}
