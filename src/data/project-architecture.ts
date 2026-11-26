import type { ProjectSlug } from "@/types/portfolio";

export const seymsoftData = [
  { name: "Inventario", detail: "Productos, existencias y proveedores." },
  { name: "Operaciones", detail: "Compras, ventas y devoluciones." },
  { name: "Clientes y pagos", detail: "Clientes, pedidos, pagos y abonos." },
] as const;

export const seymsoftPurchase = [
  {
    id: "web",
    name: "Web",
    title: "Del catálogo al carrito",
    description:
      "El cliente elige un producto en la tienda de Papelería Magic y confirma los artículos y las cantidades del carrito.",
    diagram: ["Catálogo", "Producto", "Carrito"],
    repository: 0,
    source:
      "blob/pruebaDespliegueFrond/frontend/src/Features/landing/shoppingCart/ShoppingCart.jsx",
  },
  {
    id: "backend",
    name: "Backend",
    title: "El carrito se convierte en pedido",
    description:
      "Al enviar el pedido, el backend guarda su cabecera y los productos incluidos. El pedido puede quedar pendiente hasta completar el pago.",
    diagram: ["Carrito", "API de pedidos", "Pedido"],
    repository: 1,
    source:
      "blob/pruebaDespliegue/src/modules/sales/orders/use-cases/createOrderUseCase.js",
  },
  {
    id: "data",
    name: "Datos",
    title: "Al completar el pago, cambia el inventario",
    description:
      "El backend registra el pago final y la venta, y descuenta las unidades vendidas en una misma transacción.",
    diagram: ["Pago final", "Venta", "Stock"],
    repository: 1,
    source: "blob/pruebaDespliegue/docs/sales-orders-atomicity-baseline.md",
  },
  {
    id: "mobile",
    name: "Móvil",
    title: "El equipo consulta la venta desde la app",
    description:
      "La aplicación móvil obtiene del backend el listado de ventas y permite abrir el detalle de una venta registrada.",
    diagram: ["API de ventas", "Listado", "Detalle"],
    repository: 2,
    source:
      "blob/developer/movil_seymsoft/lib/data/repositories/sales_repository.dart",
  },
] as const;

type Stage = {
  id: string;
  name: string;
  description: string;
  repository?: number;
};

export const architectureStages: Record<
  ProjectSlug,
  readonly [Stage, ...Stage[]]
> = {
  "seym-soft": [
    {
      id: "web",
      name: "Tienda web",
      description:
        "La tienda de Papelería y Variedades Magic es la parte pública del proyecto. Su portada y catálogo están disponibles desde el navegador.",
      repository: 0,
    },
    {
      id: "backend",
      name: "Backend",
      description:
        "El servicio backend sostiene las operaciones del sistema de gestión, entre ellas las de inventario, compras y ventas.",
      repository: 1,
    },
    {
      id: "data",
      name: "Datos",
      description:
        "Información del negocio que el sistema organiza para gestionar sus operaciones.",
      repository: 1,
    },
    {
      id: "mobile",
      name: "App móvil",
      description:
        "SeymSoft cuenta con un cliente móvil que forma parte del mismo sistema de gestión. Su código se mantiene en un repositorio propio.",
      repository: 2,
    },
  ],
  reciclaje: [
    {
      id: "capture",
      name: "Captura",
      description:
        "La interfaz toma una imagen desde la cámara para iniciar la clasificación.",
    },
    {
      id: "api",
      name: "API Flask",
      description:
        "La aplicación usa una API de Flask para conectar la interfaz web con el procesamiento de la imagen.",
    },
    {
      id: "model",
      name: "Modelo ONNX",
      description:
        "El modelo analiza la imagen. Su entrenamiento fue uno de los principales retos del proyecto.",
    },
    {
      id: "result",
      name: "Resultado",
      description:
        "La interfaz muestra la categoría identificada entre papel y cartón, vidrio, plástico y residuos orgánicos.",
      repository: 0,
    },
  ],
};
