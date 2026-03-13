const WA_NUMBER = "528331112410";

export function buildWhatsAppUrl(productName: string): string {
  const message = `Hola! Quisiera saber mas acerca de ${productName}`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
