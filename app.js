// =======================================
// 💊 Control de Medicamentos (Modo Consola)
// =======================================

const estado = {
  medicamentos: [],
  contadorId: 1,
};

const HORARIOS_VALIDOS = ["mañana", "tarde", "noche"];

function normalizarTexto(txt) {
  return String(txt ?? "").trim();
}

function normalizarHorario(txt) {
  return normalizarTexto(txt).toLowerCase();
}

function formatearHorario(txt) {
  const h = normalizarHorario(txt);
  if (!HORARIOS_VALIDOS.includes(h)) return null;
  return h.charAt(0).toUpperCase() + h.slice(1);
}

function logTitulo(titulo) {
  console.log("\n==============================");
  console.log(titulo);
  console.log("==============================");
}

function comenzar() {
  logTitulo("✅ Comandos disponibles");
  console.log("Iniciar la app: comenzar()");
  console.log("Agregar un medicamento: agregarMedicamento()");
  console.log("Ver todos los medicamentos: listarMedicamentos()");
  console.log("Marcar o desmarcar el medicamento ya tomado: marcarTomado()");
  console.log("Mostrar los medicamentos pendientes de tomar: pendientes()");
  console.log("Eliminar un medicamento: eliminarMedicamento()");
  console.log("Reiniciar las tomas del día a 0: reiniciarTomas()");
  console.log("Visualizar el estado de la app: verEstado()");
  console.log(" ===============================================");
  console.log("\nTip: primero ejecuta listarMedicamentos() para ver los ID.");
}

function agregarMedicamento() {
  logTitulo("➕ Agregar medicamento");

  const nombre = normalizarTexto(prompt("Nombre del medicamento:"));
  if (!nombre) return console.warn("❌ Nombre vacío. Cancelado.");

  const dosis = normalizarTexto(prompt("Dosis (ej: 1 pastilla, 10 ml):"));
  if (!dosis) return console.warn("❌ Dosis vacía. Cancelado.");

  const horarioInput = prompt("Horario (Mañana / Tarde / Noche):");
  const horario = formatearHorario(horarioInput);
  if (!horario) return console.warn("❌ Horario inválido. Usa: Mañana, Tarde o Noche.");

  const duplicado = estado.medicamentos.some(
    (m) => m.nombre.toLowerCase() === nombre.toLowerCase() && m.horario === horario
  );
  if (duplicado) return console.warn("⚠️ Ya existe ese medicamento en ese horario.");

  const nuevo = {
    id: estado.contadorId++,
    nombre,
    dosis,
    horario,
    tomadoHoy: false,
  };

  estado.medicamentos.push(nuevo);

  console.log("✅ Agregado:", nuevo);
  console.log("👉 Ejecuta listarMedicamentos() para ver la lista completa.");
}

function listarMedicamentos() {
  logTitulo("📋 Lista de medicamentos");

  if (estado.medicamentos.length === 0) {
    console.log("No hay medicamentos registrados.");
    return;
  }

  console.table(
    estado.medicamentos.map((m) => ({
      ID: m.id,
      Nombre: m.nombre,
      Dosis: m.dosis,
      Horario: m.horario,
      TomadoHoy: m.tomadoHoy ? "Sí" : "No",
    }))
  );

  console.log("Tip: Usa el ID para marcarTomado() o eliminarMedicamento().");
}

function encontrarPorId(idStr) {
  const id = Number(normalizarTexto(idStr));
  if (!Number.isInteger(id) || id <= 0) return null;
  return estado.medicamentos.find((m) => m.id === id) ?? null;
}

function marcarTomado() {
  logTitulo("✅ Marcar / desmarcar tomado hoy");

  if (estado.medicamentos.length === 0) {
    console.log("No hay medicamentos registrados.");
    return;
  }

  listarMedicamentos();
  const idStr = prompt("Ingresa el ID a marcar/desmarcar:");
  const med = encontrarPorId(idStr);

  if (!med) {
    console.warn("❌ ID no encontrado.");
    return;
  }

  med.tomadoHoy = !med.tomadoHoy;

  console.log(`✅ ${med.nombre} ahora está:`, med.tomadoHoy ? "Tomado ✅" : "No tomado ❌");
  console.log("👉 Ejecuta pendientes() para ver lo que falta.");
}

function pendientes() {
  logTitulo("⏳ Pendientes de hoy");

  if (estado.medicamentos.length === 0) {
    console.log("No hay medicamentos registrados.");
    return;
  }

  const pendientes = estado.medicamentos.filter((m) => !m.tomadoHoy);

  if (pendientes.length === 0) {
    console.log("¡No tienes pendientes! ✅");
    return;
  }

  const orden = { Mañana: 1, Tarde: 2, Noche: 3 };
  pendientes.sort((a, b) => (orden[a.horario] ?? 99) - (orden[b.horario] ?? 99));

  console.table(
    pendientes.map((m) => ({
      ID: m.id,
      Horario: m.horario,
      Nombre: m.nombre,
      Dosis: m.dosis,
    }))
  );
}

function eliminarMedicamento() {
  logTitulo("🗑 Eliminar medicamento");

  if (estado.medicamentos.length === 0) {
    console.log("No hay medicamentos registrados.");
    return;
  }

  listarMedicamentos();
  const idStr = prompt("Ingresa el ID a eliminar:");
  const med = encontrarPorId(idStr);

  if (!med) {
    console.warn("❌ ID no encontrado.");
    return;
  }

  const conf = normalizarTexto(prompt(`¿Eliminar "${med.nombre}" (ID ${med.id})? (s/n)`)).toLowerCase();
  if (conf !== "s" && conf !== "si" && conf !== "sí") {
    console.log("Cancelado.");
    return;
  }

  estado.medicamentos = estado.medicamentos.filter((m) => m.id !== med.id);
  console.log("✅ Eliminado.");
  listarMedicamentos();
}

function reiniciarTomas() {
  logTitulo("🔄 Reiniciar tomas del día");

  if (estado.medicamentos.length === 0) {
    console.log("No hay medicamentos registrados.");
    return;
  }

  const conf = normalizarTexto(prompt("Esto pondrá todos como NO tomado. ¿Continuar? (s/n)")).toLowerCase();
  if (conf !== "s" && conf !== "si" && conf !== "sí") {
    console.log("Cancelado.");
    return;
  }

  for (const m of estado.medicamentos) m.tomadoHoy = false;
  console.log("✅ Tomas reiniciadas.");
  listarMedicamentos();
}

function verEstado() {
  console.log(estado);
}

console.log("💊 App cargada. Escribe comenzar() en la consola para comenzar.");
