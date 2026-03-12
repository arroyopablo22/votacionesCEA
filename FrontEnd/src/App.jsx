import { createSignal, Show, onMount, createEffect } from "solid-js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import toast, { Toaster } from "solid-toast";
import Chart from "chart.js/auto";
Chart.register(ChartDataLabels);

let canvasRef;
let chart;

const App = () => {
  const [grado, setGrado] = createSignal("");
  const [candidatos, setCandidatos] = createSignal([]);
  const [estudiantes, setEstudiantes] = createSignal([]);
  const [resultados, setResultados] = createSignal([]);
  const [candidatoId, setCandidatoId] = createSignal("");
  const [estudianteId, setEstudianteId] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [mostrarLogin, setMostrarLogin] = createSignal(false);
  const [password, setPassword] = createSignal("");
  const [accesoPermitido, setAccesoPermitido] = createSignal(false);

  const CLAVE = "-VotacionesCEA2026..";

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

  //Función para cargar resultados:
  async function cargarResultados() {
    try {
      const res = await fetch(`https://votacionescea-production.up.railway.app/api/cargar_resultados.php`);
      const data = await res.json();
      setResultados(data);
    } catch (error) {
      console.error("Error cargando resultados:", error);
    }
  };

  // Función para registrar voto
  const registrarVoto = (event) => {
    event.preventDefault();
    setLoading(true);

    if (estudianteId()) {


      fetch("https://votacionescea-production.up.railway.app/api/registrar_voto.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          votante_id: estudianteId(),
          candidato_id: candidatoId(),
        }),
      })
        .then((response) => response.json())
        .then(() => {

          toast.success("🗳️🎉 ¡Gracias por votar!\n Tu participación es importante");
          setLoading(false);
          setGrado("");
          setEstudianteId("");
          setEstudiantes([]);
        })
        .catch((error) => {
          console.error("Error al registrar voto:", error);
          setLoading(false);
        });

    } else {
      alert("Por favor selecciona un estudiante.");
    }
  };

  onMount(() => {
    cargarCandidatos();
  });

  createEffect(() => {

    if (!accesoPermitido() || !canvasRef) return;

    const labels = resultados().map(c => c.nombre);
    const votos = resultados().map(c => c.total_votos);

    const ctx = canvasRef.getContext("2d");

    if (chart) chart.destroy();

    const colores = [
      "#ff6384",
      "#36a2eb",
      "#ffce56",
      "#4bc0c0",
      "#9966ff",
      "#ff9f40"
    ];

    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Votos",
          data: votos,
          backgroundColor: labels.map((_, i) => colores[i % colores.length]),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          datalabels: {
            color: "white",
            anchor: "center",
            align: "center",
            font: {
              weight: "bold",
              size: 20
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: "black",
              font: {
                weight: "bold"
              }
            }
          }
        },
      }
    });

  });

  function onChangeGrade(e) {
    setGrado(e.target.value);
    cargarEstudiantes();
  }

  async function verificarClave() {
    if (password() === CLAVE) {

      await cargarResultados();

      setAccesoPermitido(true);
      setMostrarLogin(false);
    } else {
      alert("Contraseña incorrecta");
    }
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
            {estudiantes()
              .sort((a, b) => a.nombre.localeCompare(b.nombre))
              .map((estudiante) => (
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
      <Toaster position="top-center" />
      <button class="btnResultados" onClick={() => setMostrarLogin(true)}>
        Ver resultados
      </button>

      <Show when={loading()} fallback={
        <>
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
            <option value="DECIMO">DÉCIMO</option>
            <option value="ONCE">ONCE</option>
          </select>
          {formulario}
        </>

      }>
        <div class="cargando">
          <p>Procesando voto...</p>
          <div class="spinner"></div>
        </div>
      </Show>

      <Show when={mostrarLogin()}>
        <div class="popup-bg">
          <div class="popup">
            <h3>Acceso a resultados</h3>

            <input
              type="password"
              placeholder="Ingrese contraseña"
              value={password()}
              onInput={(e) => setPassword(e.target.value)}
            />

            <button onClick={verificarClave}>Entrar</button>
            <button onClick={() => setMostrarLogin(false)}>Cancelar</button>
          </div>
        </div>
      </Show>

      <Show when={accesoPermitido()}>
        <div class="popup-bg">
          <div class="popup">
            <h2>Resultados de la votación</h2>
            <canvas ref={canvasRef}></canvas>

            <button onClick={() => setAccesoPermitido(false)}>Cerrar</button>
          </div>
        </div>
      </Show>
    </div >
  );
};

export default App;
