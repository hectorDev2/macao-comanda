// Datos de la carta adaptados desde el JSON del usuario
// Estructura compatible con la página Menu: categorías con items { name, description, price, image, featured? }

export interface MenuItem {
  name: string;
  description: string;
  price: number;
  image: string;
  featured?: boolean;
  requiresKitchen?: boolean; // Indica si requiere preparación en cocina
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

// Imágenes específicas del restaurante organizadas por categoría
const images = {
  // Parrilla
  picana: "/images/parrilla/picana.webp",
  churrasco: "/images/parrilla/churrasco-parrilla.jpg",
  bife: "/images/parrilla/bife-parrilla.webp",
  cuadril: "/images/parrilla/cuadril-parrilla.jpeg",
  lomoFino: "/images/parrilla/lomo-fino.jpg",
  asadoTira: "/images/parrilla/asado-de-tira.jpg",
  churrasquito: "/images/parrilla/churrasquito.jpg",
  calabresaGrill: "/images/parrilla/calabresa-grill.jpg",
  toscanaGrill: "/images/parrilla/toscana-grill.jpg",

  // Premium
  bifePremium: "/images/parrilla/bife-parrilla.webp",
  tomahawk: "/images/parrilla/lomo-fino.jpg",
  picanaBrasilera: "/images/parrilla/picana.webp",
  comboCarnivoro: "/images/parrilla/asado-de-tira.jpg",

  // Alitas
  alitasBBQ: "/images/alitas/Alitas BBQ.jpg",
  alitasAcevichadas: "/images/alitas/alitas acevichadas.webp",
  alitasBufalo: "/images/alitas/Alitas bufalo.jpg",
  alitasCrispy: "/images/alitas/Alitas crispy.jpg",
  comboAlitas: "/images/alitas/Combo de alitas.webp",

  // Pollos
  pechugaGrill: "/images/pollos/Pechuga grill.avif",
  pechugaChampiñones:
    "/images/pollos/Pechuga%20en%20salsa%20de%20champi%C3%B1ones.avif",
  pechuga3Quesos: "/images/pollos/Pechuga en 3 quesos  .jpg",
  pechugaMaracuya: "/images/pollos/pollo-en-salsa-de-maracuya.jpg",
  pechugaNapolitana: "/images/pollos/Pechuga napolitana.jpg",
  brochetas: "/images/pollos/brochetas-de-pollo.png",

  // Pastas
  tallarinesAlfredo: "/images/pastas/Tallarines Alfredo.jpg",
  macarronesCheese: "/images/pastas/Macarrones and cheese.webp",
  tallarinSaltado: "/images/pastas/Tallarin-saltado.jpg",

  // Refrescos
  maizMoradoVaso: "/images/refrescos/Ma%C3%ADz%20morado%20(vaso).jpg",
  maizMoradoJarra: "/images/refrescos/Ma%C3%ADz%20morado%20(jarra)%20%20.webp",
  maracuyaVaso: "/images/refrescos/Maracuy%C3%A1%20(vaso).webp",
  maracuyaJarra: "/images/refrescos/Maracuy%C3%A1%20(jarra).jpg",
  copoazuVaso: "/images/refrescos/Copoaz%C3%BA%20(vaso).jpg",
  copoazuJarra: "/images/refrescos/refresco%20Copoaz%C3%BA%20(jarra).jpg",
  limonadaVaso: "/images/refrescos/Limonada Frozen (vaso).jpeg",
  limonadaJarra: "/images/refrescos/Limonada Frozen (jarra).jpg",

  // Gaseosas
  cocaCola500: "/images/gaseosas/Coca Cola 500ml.webp",
  cocaCola2L: "/images/gaseosas/Coca Cola 2L.webp",
  incaKola500: "/images/gaseosas/Inca Kola 500ml.webp",
  incaKola2L: "/images/gaseosas/Inca Kola 2L.webp",
  fanta500: "/images/gaseosas/Fanta 500ml.webp",
  fanta2L: "/images/gaseosas/Fanta 2L.webp",
  sprite500: "/images/gaseosas/Sprite 500ml.webp",
  sprite2L: "/images/gaseosas/Sprite 2L.webp",

  // Aguas
  sanLuis: "/images/aguas/San Luis 500ml.webp",
  sanCarlos: "/images/aguas/San Carlos 500ml.webp",
  cielo: "/images/aguas/Cielo 500ml.webp",

  // Vinos
  tabernero: "/images/vinos/Tabernero.webp",
  queirolo: "/images/vinos/Queirolo.png",
  tacama: "/images/vinos/Tacama.webp",
  casillero: "/images/vinos/Casillero del Diablo.webp",

  // Cervezas
  pilsen: "/images/cervezas/pilsen.webp",
  corona: "/images/cervezas/corona.webp",
  cusquena: "/images/cervezas/Cusquena.webp",
  heineken: "/images/cervezas/Heineken.png",

  // Cócteles
  piscoSour: "/images/cocteles/Pisco Sour.jpg",
  mojito: "/images/cocteles/Mojito.webp",
  caipirinha: "/images/cocteles/caipirinha.jpg",
  pinaColada: "/images/cocteles/pina-colada.jpg",
  daikiri: "/images/cocteles/daikiri.webp",
  chilcano: "/images/cocteles/chilcano.webp",
  cubaLibre: "/images/cocteles/cuba-libre.jpg",

  // Bebidas Calientes
  cafe: "/images/bebidas-calientes/cafe.JPG",
  te: "/images/bebidas-calientes/te.jpg",
  anis: "/images/bebidas-calientes/aniz.jpg",
  manzanilla: "/images/bebidas-calientes/Manzanilla.jpg",
  tePiteado: "/images/bebidas-calientes/te piteado.jpg",
};

export const menuCategories: MenuCategory[] = [
  {
    title: "Parrilla",
    items: [
      {
        name: "Picaña",
        description:
          "¡El orgullo brasileño! Jugoso corte de picaña que te transportará al corazón de Brasil. Acompañado de yuca dorada crujiente y ensalada fresca. ¡Una experiencia carnívora inolvidable!",
        price: 65,
        image: images.picana,
      },
      {
        name: "Churrasco a la parrilla",
        description:
          "¡Clásico que nunca pasa de moda! Churrasco súper tierno que se derrite en tu boca, con papitas doradas perfectas y ensalada súper fresca. ¡El combo perfecto!",
        price: 45,
        image: images.churrasco,
      },
      {
        name: "Bife a la parrilla",
        description:
          "¡Para los amantes de la carne perfecta! Bife súper jugoso sellado a la parrilla con el punto exacto que te gusta. Viene con papas que te harán suspirar. ¡Prepárate para el placer!",
        price: 50,
        image: images.bife,
      },
      {
        name: "Cuadril a la parrilla",
        description:
          "¡Directito de Argentina! El cuadril más suave y sabroso que probarás, con ese toque criollo que nos encanta. Acompañado de guarniciones tradicionales que te conquistarán.",
        price: 48,
        image: images.cuadril,
      },
      {
        name: "Lomo fino",
        description:
          "¡La joya de la corona! El corte más elegante y tierno que existe. Se deshace como mantequilla y tiene un sabor que te hará cerrar los ojos de placer. ¡Preparado con amor y perfección!",
        price: 55,
        image: images.lomoFino,
      },
      {
        name: "Asado de tira",
        description:
          "¡Para compartir y disfrutar! Costillas tiernas cocinadas lentamente hasta lograr ese sabor ahumado irresistible. Cada bocado es una explosión de sabor que te conecta con la tradición.",
        price: 42,
        image: images.asadoTira,
      },
      {
        name: "Churrasquito",
        description:
          "¡Pequeño pero poderoso! 8 brochetas cargadas de sabor con Toscana jugosa, arroz, papitas, ensalada fresca y plátano dulce. ¡Perfecto para cuando quieres de todo un poquito!",
        price: 20,
        image: images.churrasquito,
      },
      {
        name: "Calabresa grill",
        description:
          "¡Sabor argentino auténtico! Chorizo calabresa artesanal hecho con amor, sellado a la parrilla y bañado en nuestro chimichurri secreto. ¡Una explosión de sabores que te hará viajar!",
        price: 38,
        image: images.calabresaGrill,
      },
      {
        name: "Toscana Grill",
        description:
          "¡El favorito de la casa! Toscana jugosa y sabrosa acompañada del combo completo: arroz esponjoso, papa doradita, ensalada crujiente y plátano dulce. ¡Calidad y precio que enamoran!",
        price: 17,
        image: images.toscanaGrill,
      },
    ],
  },
  {
    title: "Cortes Premium",
    items: [
      {
        name: "Bife Premium",
        description:
          "¡Éste sí que es un monstruo! 500 gramos de puro bife premium que te dejará sin palabras, acompañado de Toscana, arroz, papa, ensalada fresca y plátano. ¡Para los que no se conforman con poco!",
        price: 50,
        image: images.bifePremium,
        featured: true,
      },
      {
        name: "Tomahawk",
        description:
          "¡El gigante de la parrilla! 500 gramos de Tomahawk espectacular que parece salido de una película. Con Toscana, arroz, papa, ensalada y plátano. ¡Perfecto para impresionar y conquistar!",
        price: 50,
        image: images.tomahawk,
        featured: true,
      },
      {
        name: "Picaña brasilera",
        description:
          "¡Samba de sabores! 500 gramos de auténtica picaña brasilera que te hará sentir el ritmo de Brasil. Con Toscana, arroz, papa, ensalada fresca y plátano. ¡Carnaval en tu mesa!",
        price: 50,
        image: images.picanaBrasilera,
      },
      {
        name: "Combo carnívoro",
        description:
          "¡Para los que no pueden elegir! Un corte premium + pechuga jugosa, más Toscana, arroz, papa, ensalada y plátano. ¡Doble proteína, doble satisfacción, doble felicidad!",
        price: 50,
        image: images.comboCarnivoro,
      },
    ],
  },
  {
    title: "Alitas",
    items: [
      {
        name: "Alitas BBQ",
        description:
          "¡Clásicas y adictivas! Alitas bañadas en nuestra salsa BBQ secreta, dulces y ahumadas como debe ser. Con papa, ensalada fresca y plátano. ¡Te chuparás los dedos!",
        price: 23,
        image: images.alitasBBQ,
      },
      {
        name: "Alitas acevichadas",
        description:
          "¡Fusión peruana espectacular! Alitas marinadas en jugo de limón y especias peruanas que despiertan todos tus sentidos. Con papa, ensalada y plátano. ¡Sabor que te conquistará!",
        price: 23,
        image: images.alitasAcevichadas,
      },
      {
        name: "Alitas búfalo",
        description:
          "¡Picantes y irresistibles! Alitas bañadas en salsa búfalo que te hará sudar de felicidad. Con papa para calmar el fuego, ensalada fresca y plátano dulce. ¡Desafío aceptado!",
        price: 23,
        image: images.alitasBufalo,
        featured: true,
      },
      {
        name: "Alitas crispy",
        description:
          "¡Crujientes por fuera, jugosas por dentro! Alitas con empanizado dorado perfecto que hace 'crack' en cada mordida. Con papa, ensalada fresca y plátano. ¡Textura que enamora!",
        price: 25,
        image: images.alitasCrispy,
      },
      {
        name: "Combo de alitas",
        description:
          "¡No puedes elegir? ¡No elijas! Combo con 2 sabores diferentes de nuestras deliciosas alitas. Con papa, ensalada y plátano. ¡Doble diversión, doble sabor, doble felicidad!",
        price: 40,
        image: images.comboAlitas,
      },
    ],
  },
  {
    title: "Pollos",
    items: [
      {
        name: "Pechuga grill",
        description:
          "¡Simple pero perfecta! Pechuga de pollo a la parrilla, jugosa y doradita por fuera. Con arroz esponjoso, papa dorada, ensalada fresca y plátano dulce. ¡Clásico que nunca falla!",
        price: 22,
        image: images.pechugaGrill,
      },
      {
        name: "Pechuga en salsa de champiñones",
        description:
          "¡Elegancia en el plato! Pechuga tierna bañada en cremosa salsa de champiñones que te hará sentir en un restaurante francés. Con arroz, papa, ensalada y plátano. ¡Sofisticación deliciosa!",
        price: 25,
        image: images.pechugaChampiñones,
      },
      {
        name: "Pechuga en 3 quesos",
        description:
          "¡Para los amantes del queso! Pechuga jugosa coronada con una mezcla cremosa de 3 quesos que se derriten y te hacen suspirar. Con arroz, papa, ensalada y plátano. ¡Triplemente deliciosa!",
        price: 25,
        image: images.pechuga3Quesos,
      },
      {
        name: "Pechuga en salsa de maracuyá",
        description:
          "¡Sabor tropical irresistible! Pechuga tierna bañada en exótica salsa de maracuyá que combina lo dulce y lo ácido perfectamente. Con arroz, papa, ensalada y plátano. ¡Viaje a los trópicos!",
        price: 25,
        image: images.pechugaMaracuya,
      },
      {
        name: "Pechuga napolitana",
        description:
          "¡La reina del plato! Pechuga empanizada doradita, cubierta con jamón y queso derretido que gotea felicidad. Con arroz, papa, ensalada y plátano. ¡Combinación ganadora!",
        price: 27,
        image: images.pechugaNapolitana,
      },
      {
        name: "Brochetas de pollo",
        description:
          "¡Pequeñas pero poderosas! 8 brochetas de pollo marinado que explotan de sabor en cada bocado. Con arroz, papa doradita, ensalada fresca y plátano. ¡Perfectas para picar y compartir!",
        price: 18,
        image: images.brochetas,
      },
    ],
  },
  {
    title: "Pastas",
    items: [
      {
        name: "Tallarines Alfredo",
        description:
          "¡Cremosidad italiana pura! Tallarines sedosos bañados en salsa Alfredo que parece una caricia de mantequilla y parmesano. ¡Comfort food que abraza el alma!",
        price: 20,
        image: images.tallarinesAlfredo,
      },
      {
        name: "Macarrones and cheese",
        description:
          "¡El sueño de todo amante del queso! Macarrones esponjosos nadando en una mezcla cremosa de quesos que te hará regresar a la infancia. ¡Pura felicidad en cada bocado!",
        price: 30,
        image: images.macarronesCheese,
      },
      {
        name: "Tallarín saltado",
        description:
          "¡Fusión chifa espectacular! Tallarines salteados al wok con vegetales frescos y carne, en esa mezcla mágica entre Perú y China. ¡Sabores que danzan en tu paladar!",
        price: 30,
        image: images.tallarinSaltado,
      },
    ],
  },
  {
    title: "Refrescos",
    items: [
      {
        name: "Maíz morado (vaso)",
        description:
          "¡Tradición peruana en cada sorbo! Refresco ancestral moradito que te conecta con nuestras raíces. Dulce, refrescante y lleno de historia.",
        price: 4,
        image: images.maizMoradoVaso,
      },
      {
        name: "Maíz morado (jarra)",
        description:
          "¡Para compartir la tradición! Jarra generosa de nuestro delicioso maíz morado. Perfecto para toda la familia.",
        price: 10,
        image: images.maizMoradoJarra,
      },
      {
        name: "Maracuyá (vaso)",
        description:
          "¡Explosión tropical! Refresco de maracuyá que te transporta a la selva peruana con cada sorbo. ¡Puro sabor amazónico!",
        price: 4,
        image: images.maracuyaVaso,
      },
      {
        name: "Maracuyá (jarra)",
        description:
          "¡Selva peruana para compartir! Jarra de maracuyá refrescante que alegra cualquier comida familiar.",
        price: 10,
        image: images.maracuyaJarra,
      },
      {
        name: "Copoazú (vaso)",
        description:
          "¡Tesoro amazónico! Fruto exótico del Amazonas con sabor único que no probarás en otro lado. ¡Aventura en cada sorbo!",
        price: 4,
        image: images.copoazuVaso,
      },
      {
        name: "Copoazú (jarra)",
        description:
          "¡Amazonas en tu mesa! Jarra de copoazú para que toda la familia disfrute este tesoro de la selva peruana.",
        price: 10,
        image: images.copoazuJarra,
      },
      {
        name: "Limonada Frozen (vaso)",
        description:
          "¡Frescura helada! Limonada súper fría que te refresca hasta el alma. ¡Perfecta para el calor amazónico!",
        price: 4,
        image: images.limonadaVaso,
      },
      {
        name: "Limonada Frozen (jarra)",
        description:
          "¡Frescura para todos! Jarra de limonada helada que mantiene a toda la familia fresca y feliz.",
        price: 12,
        image: images.limonadaJarra,
      },
    ],
  },
  {
    title: "Gaseosas",
    items: [
      {
        name: "Coca Cola 500ml",
        description:
          "¡El clásico mundial! La gaseosa más famosa del planeta para acompañar tu comida perfectamente.",
        price: 4,
        image: images.cocaCola500,
      },
      {
        name: "Coca Cola 2L",
        description:
          "¡Coca Cola familiar! Botella grande para compartir esa felicidad burbujeante con todos.",
        price: 15,
        image: images.cocaCola2L,
      },
      {
        name: "Inca Kola 500ml",
        description:
          "¡Sabor nacional! La gaseosa dorada del Perú que sabe a felicidad y tradición. ¡Orgullo peruano!",
        price: 4,
        image: images.incaKola500,
      },
      {
        name: "Inca Kola 2L",
        description:
          "¡Inca Kola para toda la familia! Botella grande de nuestro orgullo nacional dorado.",
        price: 15,
        image: images.incaKola2L,
      },
      {
        name: "Fanta 500ml",
        description:
          "¡Naranja burbujeante! Refrescante gaseosa de naranja que alegra tu comida con su sabor cítrico.",
        price: 4,
        image: images.fanta500,
      },
      {
        name: "Fanta 2L",
        description:
          "¡Fanta familiar! Botella grande de sabor naranja para compartir la diversión.",
        price: 15,
        image: images.fanta2L,
      },
      {
        name: "Sprite 500ml",
        description:
          "¡Lima-limón refrescante! Gaseosa cristalina que limpia el paladar y refresca tu experiencia.",
        price: 4,
        image: images.sprite500,
      },
      {
        name: "Sprite 2L",
        description:
          "¡Sprite familiar! Botella grande de frescura lima-limón para toda la mesa.",
        price: 15,
        image: images.sprite2L,
      },
    ],
  },
  {
    title: "Aguas",
    items: [
      {
        name: "San Luis 500ml",
        description:
          "¡Pureza en botella! Agua mineral natural que hidrata y purifica. Perfecta para acompañar cualquier comida.",
        price: 3,
        image: images.sanLuis,
      },
      {
        name: "San Carlos 500ml",
        description:
          "¡Hidratación pura! Agua mineral refrescante que complementa perfectamente tu experiencia gastronómica.",
        price: 3,
        image: images.sanCarlos,
      },
      {
        name: "Cielo 500ml",
        description:
          "¡Frescura celestial! Agua pura y cristalina que calma la sed y limpia el paladar.",
        price: 3,
        image: images.cielo,
      },
    ],
  },
  {
    title: "Vinos",
    items: [
      {
        name: "Tabernero",
        description:
          "¡Tradición peruana! Vino nacional de calidad que acompaña perfectamente nuestras carnes a la parrilla.",
        price: 35,
        image: images.tabernero,
      },
      {
        name: "Queirolo",
        description:
          "¡Elegancia nacional! Vino peruano seleccionado que eleva cualquier cena a otro nivel de sofisticación.",
        price: 35,
        image: images.queirolo,
      },
      {
        name: "Tacama",
        description:
          "¡Historia en copa! Vino de una de las bodegas más antiguas de América, perfecto para ocasiones especiales.",
        price: 35,
        image: images.tacama,
      },
      {
        name: "Casillero del Diablo",
        description:
          "¡Leyenda chilena! Vino reserva con carácter y personalidad que conquista desde el primer sorbo.",
        price: 50,
        image: images.casillero,
      },
    ],
  },
  {
    title: "Cervezas",
    items: [
      {
        name: "Pilsen",
        description:
          "¡Clásica peruana! Cerveza nacional que refresca y acompaña perfectamente nuestros platos criollos.",
        price: 10,
        image: images.pilsen,
      },
      {
        name: "Corona",
        description:
          "¡Sabor mexicano! Cerveza suave y refrescante que se disfruta mejor con una rodaja de limón.",
        price: 10,
        image: images.corona,
      },
      {
        name: "Cusqueña",
        description:
          "¡Orgullo cusqueño! Cerveza peruana de calidad premium que honra la tradición cervecera nacional.",
        price: 10,
        image: images.cusquena,
      },
      {
        name: "Heineken",
        description:
          "¡Calidad holandesa! Cerveza internacional con sabor distintivo y refrescante para paladares exigentes.",
        price: 10,
        image: images.heineken,
      },
    ],
  },
  {
    title: "Cócteles",
    items: [
      {
        name: "Pisco Sour",
        description:
          "¡El orgullo nacional! Cóctel peruano por excelencia con pisco, limón, clara de huevo y amargo de angostura. Cremoso, refrescante y con ese toque ácido que te despierta. ¡¡¡Salud!!!",
        price: 15,
        image: images.piscoSour,
        featured: true,
      },
      {
        name: "Mojito",
        description:
          "¡Frescura cubana! Refrescante cóctel con hierbabuena, ron y lima que te transporta al Caribe en cada sorbo.",
        price: 15,
        image: images.mojito,
      },
      {
        name: "Caipirinha",
        description:
          "¡Sabor brasileño! Cachaça, lima y azúcar en perfecta armonía que te hace sentir el ritmo de Brasil.",
        price: 15,
        image: images.caipirinha,
      },
      {
        name: "Piña Colada",
        description:
          "¡Trópico en copa! Mezcla cremosa de piña, coco y ron que te lleva directo a una playa paradisíaca.",
        price: 15,
        image: images.pinaColada,
      },
      {
        name: "Daikiri",
        description:
          "¡Clásico cubano! Ron, lima y azúcar en equilibrio perfecto. Simple, refrescante y eternamente elegante.",
        price: 15,
        image: images.daikiri,
      },
      {
        name: "Chilcano",
        description:
          "¡Peruanidad refrescante! Pisco con ginger ale y limón, burbujeante y cítrico. ¡Perfecto para el calor!",
        price: 15,
        image: images.chilcano,
      },
      {
        name: "Cuba Libre",
        description:
          "¡Libertad en copa! Ron con cola y lima, simple pero irresistible. ¡El cóctel que nunca pasa de moda!",
        price: 15,
        image: images.cubaLibre,
      },
    ],
  },
  {
    title: "Bebidas Calientes",
    items: [
      {
        name: "Café",
        description:
          "¡Energía peruana! Café aromático y fuerte que despierta tus sentidos y te da la energía perfecta.",
        price: 4,
        image: images.cafe,
      },
      {
        name: "Té",
        description:
          "¡Calor reconfortante! Té caliente que abraza el alma y te da esa pausa relajante que necesitas.",
        price: 4,
        image: images.te,
      },
      {
        name: "Anís",
        description:
          "¡Tradición andina! Infusión de anís calentita que calma y relaja con su sabor ancestral peruano.",
        price: 4,
        image: images.anis,
      },
      {
        name: "Manzanilla",
        description:
          "¡Tranquilidad natural! Infusión suave de manzanilla que relaja y prepara para un descanso perfecto.",
        price: 4,
        image: images.manzanilla,
      },
      {
        name: "Té Piteado",
        description:
          "¡Té con personalidad! Té caliente con un toque de licor que calienta el cuerpo y alegra el corazón.",
        price: 10,
        image: images.tePiteado,
      },
    ],
  },
];
