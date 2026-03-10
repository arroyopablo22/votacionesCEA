import { createSignal, Show } from "solid-js";

const App = () => {
  const [grado, setGrado] = createSignal("");
  const [candidatos, setCandidatos] = createSignal([]);
  const [estudiantes, setEstudiantes] = createSignal([]);
  const [candidatoId, setCandidatoId] = createSignal("");
  const [estudianteId, setEstudianteId] = createSignal("");

  // Función para cargar estudiantes según el grado seleccionado
  const cargarEstudiantes = () => {
    if (grado()) {
      fetch(`https://votacionescea-production.up.railway.app/api/cargar_estudiantes.php?grado=${grado()}`)
        .then((response) => response.json())
        .then((data) => setEstudiantes(data))
        .catch((error) => console.error("Error al cargar estudiantes:", error));
    }
  };

  // Función para cargar candidatos según el grado seleccionado
  const cargarCandidatos = () => {
    fetch(`https://votacionescea-production.up.railway.app/api/cargar_candidatos.php`)
      .then((response) => response.json())
      .then((data) => setCandidatos(data))
      .catch((error) => console.error("Error al cargar candidatos:", error));
  };

  // Función para registrar voto
  const registrarVoto = (event) => {
    event.preventDefault();
    if (estudianteId()) {
      fetch("https://votacionescea-production.up.railway.app/api/registrar_voto.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ votante_id: estudianteId(), candidato_id: candidatoId() }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.mensaje);
          setEstudianteId("");
          setEstudiantes([]);
        })
        .catch((error) => console.error("Error al registrar voto:", error));
    } else {
      alert("Por favor selecciona un estudiante.");
    }
  };

  cargarCandidatos();

  function onChangeGrade(e) {
    setGrado(e.target.value);
    cargarEstudiantes();
  }

  const formulario =
    <Show when={grado().length > 0}>
      <div>
        <form onSubmit={registrarVoto}>
          <h2>Registrar Voto</h2>

          <label for="estudiante">Seleccione un estudiante:</label>
          <select
            id="estudiante"
            value={estudianteId()}
            onChange={(e) => setEstudianteId(e.target.value)}
            required
          >
            <option value="" hidden>Selecciona un estudiante</option>
            {estudiantes().map((estudiante) => (
              <option value={estudiante.id}>{estudiante.nombre}</option>
            ))}
          </select>

          <Show when={estudianteId().length > 0}>
            <h2>Selecciona un Candidato</h2>
            <div className="candidatos-container">
              {candidatos()
                .slice()
                .sort((a, b) => a.id - b.id)
                .map((candidato) => (
                  <label className="candidato">
                    <input
                      type="radio"
                      name="candidato"
                      value={candidato.id}
                      onChange={() => setCandidatoId(candidato.id)}
                      required
                    />
                    <br />
                    <img
                      src={`${candidato.imagen_url}`}
                      alt={candidato.nombre}
                    />
                    <br />
                    <b>{candidato.nombre}</b>
                  </label>
                ))}
            </div>

            <button type="submit">Registrar Voto</button>
          </Show>
        </form>
      </div>
    </Show>

  return (
    <div class="fondo">
      <h1>Elección de personero 2026</h1>

      <label for="grado">Selecciona el grado:</label>
      <select id="grado" onChange={(e) => onChangeGrade(e)} required>
        <option value="">Selecciona un grado</option>
        <option value="PROFESOR">PROFESOR</option>
        <option value="PREESCOLAR">PREESCOLAR</option>
        <option value="PRIMERO">PRIMERO</option>
        <option value="SEGUNDO">SEGUNDO</option>
        <option value="TERCERO">TERCERO</option>
        <option value="CUARTO">CUARTO</option>
        <option value="QUINTO">QUINTO</option>
        <option value="SEXTO">SEXTO</option>
        <option value="SEPTIMO">SEPTIMO</option>
        <option value="OCTAVO">OCTAVO</option>
        <option value="NOVENO">NOVENO</option>
        <option value="DÉCIMO">DÉCIMO</option>
        <option value="ONCE">ONCE</option>
      </select>


      {formulario}
    </div>
  );
};

export default App;
