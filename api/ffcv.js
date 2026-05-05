const FFCV_TEAMS = {
  FB: {
    nombre: "Femenino B",
    temporada: "2025-2026",
    modalidad: "FEMENI F11",
    competicion: "Pendiente configurar",
    grupo: "Pendiente configurar"
  },
  FC: {
    nombre: "Femenino C",
    temporada: "2025-2026",
    modalidad: "FEMENI F11",
    competicion: "Pendiente configurar",
    grupo: "Pendiente configurar"
  },
  FD: {
    nombre: "Femenino D",
    temporada: "2025-2026",
    modalidad: "FEMENI F11",
    competicion: "Pendiente configurar",
    grupo: "Pendiente configurar"
  },
  IC: {
    nombre: "Infantil C",
    temporada: "2025-2026",
    modalidad: "MASCULI F11",
    competicion: "Pendiente configurar",
    grupo: "Pendiente configurar"
  },
  ID: {
    nombre: "Infantil D",
    temporada: "2025-2026",
    modalidad: "MASCULI F11",
    competicion: "Pendiente configurar",
    grupo: "Pendiente configurar"
  },
  AC: {
    nombre: "Alevin C",
    temporada: "2025-2026",
    modalidad: "MASCULI F8",
    competicion: "Pendiente configurar",
    grupo: "Pendiente configurar"
  },
  AD: {
    nombre: "Alevin D",
    temporada: "2025-2026",
    modalidad: "MASCULI F8",
    competicion: "Pendiente configurar",
    grupo: "Pendiente configurar"
  },
  BC: {
    nombre: "Benjamin C",
    temporada: "2025-2026",
    modalidad: "MASCULI F8",
    competicion: "Segona FFCV Benjami 2n. any Valencia",
    grupo: "Lliga Regular Grup 9",
    codGrupo: "905027526",
    codJornada: "15",
    codEquipo: "14442"
  },
  BD: {
    nombre: "Benjamin D",
    temporada: "2025-2026",
    modalidad: "MASCULI F8",
    competicion: "Pendiente configurar",
    grupo: "Pendiente configurar"
  }
};

function emptyPayload(equipo, cfg) {
  return {
    equipo,
    fuente: "FFCV",
    estadoConexion: cfg.codGrupo ? "sin_datos" : "manual",
    actualizado: new Date().toISOString(),
    nombre: cfg.nombre,
    temporada: cfg.temporada,
    modalidad: cfg.modalidad,
    competicion: cfg.competicion,
    grupo: cfg.grupo,
    posicion: null,
    partidos: null,
    victorias: null,
    empates: null,
    derrotas: null,
    golesFavor: null,
    golesContra: null,
    puntos: null,
    plantilla: [],
    goleadoras: []
  };
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

async function fetchClasificacion(cfg) {
  const url = new URL("https://ffcv.es/competiciones/api/clasificaciones/clasificaciones_ajax.php");
  url.searchParams.set("cod_grupo", cfg.codGrupo);
  url.searchParams.set("cod_jornada", cfg.codJornada || "");

  const response = await fetch(url, {
    headers: {
      accept: "*/*",
      referer: "https://ffcv.es/competiciones/",
      "user-agent": "Mozilla/5.0"
    }
  });

  if (!response.ok) {
    throw new Error(`FFCV respondio ${response.status}`);
  }

  return response.json();
}

async function fetchPlantilla(cfg) {
  if (!cfg.codEquipo) return [];

  const url = new URL("https://ffcv.es/competiciones/api/equipos/plantilla_home.php");
  url.searchParams.set("cod_equipo", cfg.codEquipo);

  const response = await fetch(url, {
    headers: {
      accept: "*/*",
      referer: `https://ffcv.es/competiciones/equipos/equipo.php?codigo_equipo=${cfg.codEquipo}`,
      "user-agent": "Mozilla/5.0"
    }
  });

  if (!response.ok) {
    throw new Error(`FFCV plantilla respondio ${response.status}`);
  }

  const data = await response.json();
  const players = Array.isArray(data.jugadores_equipo) ? data.jugadores_equipo : [];

  return players.map(player => ({
    codJugador: player.codjugador || "",
    nombre: player.nombre || "",
    dorsal: player.dorsal || "",
    posicionFfcv: player.posicion || "",
    posicion: mapPosition(player.posicion)
  })).filter(player => player.nombre);
}

function mapPosition(position) {
  const raw = String(position || "").toLowerCase();
  if (raw.includes("portero")) return "POR";
  if (raw.includes("defensa")) return "DEF";
  if (raw.includes("centro") || raw.includes("medio")) return "MC";
  if (raw.includes("delanter")) return "DC";
  return "MC";
}

function mapClasificacion(equipo, cfg, data) {
  const base = emptyPayload(equipo, cfg);
  const rows = Array.isArray(data.clasificacion) ? data.clasificacion : [];
  const row = rows.find(item => String(item.codequipo) === String(cfg.codEquipo))
    || rows.find(item => String(item.nombre || "").toLowerCase().includes("levante"));

  if (!row) {
    return {
      ...base,
      estadoConexion: "equipo_no_encontrado",
      competicion: data.competicion || base.competicion,
      grupo: data.grupo || base.grupo
    };
  }

  return {
    ...base,
    estadoConexion: "conectado",
    competicion: data.competicion || base.competicion,
    grupo: data.grupo || base.grupo,
    jornada: data.jornada || cfg.codJornada || null,
    fechaJornada: data.fecha_jornada || null,
    nombreFfcv: row.nombre,
    codEquipo: row.codequipo,
    posicion: toNumber(row.posicion),
    partidos: toNumber(row.jugados),
    victorias: toNumber(row.ganados),
    empates: toNumber(row.empatados),
    derrotas: toNumber(row.perdidos),
    golesFavor: toNumber(row.goles_a_favor),
    golesContra: toNumber(row.goles_en_contra),
    puntos: toNumber(row.puntos),
    coeficiente: row.coeficiente || null,
    racha: Array.isArray(row.racha_partidos) ? row.racha_partidos.map(r => r.tipo).filter(Boolean) : [],
    plantilla: [],
    goleadoras: []
  };
}

export default async function handler(req, res) {
  const equipo = String(req.query.equipo || "").toUpperCase();
  const cfg = FFCV_TEAMS[equipo];

  if (!cfg) {
    return res.status(404).json({ error: "Equipo no configurado" });
  }

  if (!cfg.codGrupo || !cfg.codEquipo) {
    return res.status(200).json(emptyPayload(equipo, cfg));
  }

  try {
    const data = await fetchClasificacion(cfg);
    const payload = mapClasificacion(equipo, cfg, data);
    payload.plantilla = await fetchPlantilla(cfg);
    return res.status(200).json(payload);
  } catch (error) {
    return res.status(200).json({
      ...emptyPayload(equipo, cfg),
      estadoConexion: "error",
      error: error.message
    });
  }
}
