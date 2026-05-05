const TEAM_FFCV = {
  FB: {
    nombre: "Femenino B",
    temporada: "2025-2026",
    modalidad: "FEMENI F11",
    competicion: "Pendiente configurar",
    grupo: "Pendiente configurar",
    posicion: null,
    partidos: null,
    victorias: null,
    empates: null,
    derrotas: null,
    golesFavor: null,
    golesContra: null,
    puntos: null,
    goleadoras: []
  },
  FC: {
    nombre: "Femenino C",
    temporada: "2025-2026",
    modalidad: "FEMENI F11",
    competicion: "Pendiente configurar",
    grupo: "Pendiente configurar",
    posicion: null,
    partidos: null,
    victorias: null,
    empates: null,
    derrotas: null,
    golesFavor: null,
    golesContra: null,
    puntos: null,
    goleadoras: []
  },
  FD: {
    nombre: "Femenino D",
    temporada: "2025-2026",
    modalidad: "FEMENI F11",
    competicion: "Pendiente configurar",
    grupo: "Pendiente configurar",
    posicion: null,
    partidos: null,
    victorias: null,
    empates: null,
    derrotas: null,
    golesFavor: null,
    golesContra: null,
    puntos: null,
    goleadoras: []
  },
  IC: {
    nombre: "Infantil C",
    temporada: "2025-2026",
    modalidad: "MASCULI F11",
    competicion: "Pendiente configurar",
    grupo: "Pendiente configurar",
    posicion: null,
    partidos: null,
    victorias: null,
    empates: null,
    derrotas: null,
    golesFavor: null,
    golesContra: null,
    puntos: null,
    goleadoras: []
  },
  ID: {
    nombre: "Infantil D",
    temporada: "2025-2026",
    modalidad: "MASCULI F11",
    competicion: "Pendiente configurar",
    grupo: "Pendiente configurar",
    posicion: null,
    partidos: null,
    victorias: null,
    empates: null,
    derrotas: null,
    golesFavor: null,
    golesContra: null,
    puntos: null,
    goleadoras: []
  },
  AC: {
    nombre: "Alevin C",
    temporada: "2025-2026",
    modalidad: "MASCULI F8",
    competicion: "Pendiente configurar",
    grupo: "Pendiente configurar",
    posicion: null,
    partidos: null,
    victorias: null,
    empates: null,
    derrotas: null,
    golesFavor: null,
    golesContra: null,
    puntos: null,
    goleadoras: []
  },
  AD: {
    nombre: "Alevin D",
    temporada: "2025-2026",
    modalidad: "MASCULI F8",
    competicion: "Pendiente configurar",
    grupo: "Pendiente configurar",
    posicion: null,
    partidos: null,
    victorias: null,
    empates: null,
    derrotas: null,
    golesFavor: null,
    golesContra: null,
    puntos: null,
    goleadoras: []
  },
  BC: {
    nombre: "Benjamin C",
    temporada: "2025-2026",
    modalidad: "MASCULI F8",
    competicion: "Segona FFCV Benjami 2n. any Valencia",
    grupo: "Lliga Regular Grup 9",
    posicion: null,
    partidos: null,
    victorias: null,
    empates: null,
    derrotas: null,
    golesFavor: null,
    golesContra: null,
    puntos: null,
    goleadoras: []
  },
  BD: {
    nombre: "Benjamin D",
    temporada: "2025-2026",
    modalidad: "MASCULI F8",
    competicion: "Pendiente configurar",
    grupo: "Pendiente configurar",
    posicion: null,
    partidos: null,
    victorias: null,
    empates: null,
    derrotas: null,
    golesFavor: null,
    golesContra: null,
    puntos: null,
    goleadoras: []
  }
};

export default function handler(req, res) {
  const equipo = String(req.query.equipo || "").toUpperCase();
  const data = TEAM_FFCV[equipo];

  if (!data) {
    return res.status(404).json({ error: "Equipo no configurado" });
  }

  return res.status(200).json({
    equipo,
    fuente: "FFCV",
    estadoConexion: "manual",
    actualizado: new Date().toISOString(),
    ...data
  });
}
