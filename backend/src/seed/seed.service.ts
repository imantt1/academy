import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module as ModuleEntity } from '../entities/module.entity';
import { Lesson } from '../entities/lesson.entity';
import { Quiz } from '../entities/quiz.entity';
import { Question } from '../entities/question.entity';

interface ModuleSeed {
  order: number;
  sharedQuizGroup: number | undefined;
  passingScore: number;
  isPremium: boolean;
  title: string;
  description: string;
  lessons: { order: number; title: string; content: string }[];
}

interface QuestionSeed {
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizSeed {
  title: string;
  questions: QuestionSeed[];
}

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(ModuleEntity) private modulesRepo: Repository<ModuleEntity>,
    @InjectRepository(Lesson) private lessonsRepo: Repository<Lesson>,
    @InjectRepository(Quiz) private quizzesRepo: Repository<Quiz>,
    @InjectRepository(Question) private questionsRepo: Repository<Question>,
  ) {}

  async run() {
    const count = await this.modulesRepo.count();
    if (count > 0) {
      this.logger.log('Seed ya ejecutado. Omitiendo...');
      return { message: 'Seed ya ejecutado previamente' };
    }

    this.logger.log('Iniciando seed de 9 módulos RTP...');

    const modulesData: ModuleSeed[] = [
      {
        order: 1, sharedQuizGroup: 1, passingScore: 70, isPremium: false,
        title: 'Anatomía del RTP',
        description: 'Fundamentos estructurales del Reinforced Thermoplastic Pipe: capas, materiales y propiedades mecánicas.',
        lessons: [
          { order: 1, title: '¿Qué es el RTP?', content: 'El RTP (Reinforced Thermoplastic Pipe) es una tubería compuesta por tres capas: una capa interior de polietileno (PE) resistente a la corrosión, una capa de refuerzo de fibras de alta resistencia (aramida, fibra de vidrio o acero) y una capa exterior de polietileno que actúa como barrera mecánica y UV.' },
          { order: 2, title: 'Capas del RTP', content: 'La capa interior (liner) de HDPE o XLPE está diseñada para resistir el fluido transportado. La capa intermedia de refuerzo soporta la presión interna y las cargas axiales. La capa exterior protege contra daño mecánico, UV y condiciones ambientales adversas.' },
          { order: 3, title: 'Propiedades mecánicas clave', content: 'Presión de trabajo típica: 40 a 100 bar. Temperatura de operación: -40°C a +65°C (dependiendo del liner). Flexibilidad: radio de curvatura mínimo de 10x el diámetro exterior. Peso: aproximadamente 1/4 del peso de tubería de acero equivalente.' },
        ],
      },
      {
        order: 2, sharedQuizGroup: 1, passingScore: 70, isPremium: false,
        title: 'Logística y Manejo del RTP',
        description: 'Transporte, almacenamiento, manejo en campo y preparación para la instalación del RTP.',
        lessons: [
          { order: 1, title: 'Transporte en carrete (spool)', content: 'El RTP se suministra en carretes de hasta 500 metros. Durante el transporte se debe evitar exposición a temperaturas extremas, impactos laterales y radios de curvatura menores al mínimo especificado por el fabricante. Los carretes deben viajar horizontalmente y asegurados.' },
          { order: 2, title: 'Almacenamiento en campo', content: 'Los carretes deben almacenarse sobre superficies planas, alejados de fuentes de calor intenso y cubiertos del sol directo si se almacenan por más de 30 días. No apilar más de 2 carretes sin soporte estructural adecuado. Registrar fecha de recepción y número de lote.' },
          { order: 3, title: 'Inspección de recepción', content: 'Verificar: número de lote, longitud del carrete, ausencia de daño en la capa exterior, rectitud de los extremos, presencia del tapón de protección en ambos extremos. Registrar cualquier anomalía en el acta de recepción antes de firmarla.' },
        ],
      },
      {
        order: 3, sharedQuizGroup: 2, passingScore: 70, isPremium: false,
        title: 'Instalación del RTP',
        description: 'Procedimientos paso a paso para la instalación correcta del RTP en campo, incluyendo zanjeo y tendido.',
        lessons: [
          { order: 1, title: 'Preparación de la zanja', content: 'La zanja debe tener un ancho mínimo de DO + 300 mm. El fondo debe ser plano y libre de piedras. Se requiere cama de arena de 100 mm bajo la tubería. La profundidad mínima de cobertura es 600 mm para cruces de caminos y 900 mm para áreas de tráfico pesado.' },
          { order: 2, title: 'Tendido y curvado en campo', content: 'El RTP puede curvarse en frío con el radio mínimo especificado. Para curvas más cerradas se usan codos prefabricados. Nunca aplanar, torcer ni doblar el tubo por encima del límite. Se debe tender a temperatura ambiente (>5°C) para evitar rigidez excesiva.' },
          { order: 3, title: 'Conexión de extremos', content: 'Los extremos del RTP se terminan con fitting de compresión o fitting roscado de acero inoxidable. El proceso incluye: corte recto del tubo, inserción del insert de aluminio, compresión de la manga exterior con herramienta hidráulica calibrada, verificación de torque de apriete.' },
        ],
      },
      {
        order: 4, sharedQuizGroup: 2, passingScore: 70, isPremium: false,
        title: 'Fusión y Conexión de Fittings',
        description: 'Técnicas de unión mecánica y fitting de RTP: tipos de conectores, procedimientos y control de calidad.',
        lessons: [
          { order: 1, title: 'Tipos de fitting para RTP', content: 'Fitting de compresión: usado para conexiones permanentes en campo. Fitting roscado: para conexiones a manifolds o equipos. Fitting electrosoldable (para sistemas con liner PE): requiere equipo de fusión. Cada tipo tiene su procedimiento específico validado por API 15S.' },
          { order: 2, title: 'Procedimiento de fitting de compresión', content: 'Paso 1: Corte recto del tubo (usar sierra mecánica, nunca amoladora). Paso 2: Limpieza del extremo con trapo limpio y alcohol isopropílico. Paso 3: Inserción del insert interno hasta tope. Paso 4: Colocación y compresión de la manga con herramienta hidráulica (presión según tabla del fabricante). Paso 5: Marcado de la conexión.' },
          { order: 3, title: 'Control de calidad de las conexiones', content: 'Cada fitting instalado debe registrarse en el dossier de calidad indicando: número de serial del fitting, fecha y hora, operador certificado, resultado de inspección visual y resultado de prueba neumática a baja presión (1.5 bar por 15 min).' },
        ],
      },
      {
        order: 5, sharedQuizGroup: 3, passingScore: 70, isPremium: false,
        title: 'Prueba Hidrostática del RTP',
        description: 'Planificación y ejecución de pruebas hidrostáticas según API 15S: procedimiento, equipos y criterios de aceptación.',
        lessons: [
          { order: 1, title: 'Bases de la prueba hidrostática', content: 'La prueba hidrostática verifica la integridad del sistema antes de poner en servicio. Según API 15S, la presión de prueba es 1.5 veces la presión máxima de operación (MAOP). La duración mínima es 4 horas para sistemas de hasta 10 km.' },
          { order: 2, title: 'Procedimiento paso a paso', content: 'Paso 1: Llenado con agua limpia y purga de aire. Paso 2: Presurización gradual hasta el 50% de la presión de prueba (Pt) y mantener 30 min. Paso 3: Presurización hasta el 100% de Pt. Paso 4: Estabilización térmica (60-90 min). Paso 5: Registro continuo de presión y temperatura durante el tiempo de prueba. Paso 6: Despresurización controlada.' },
          { order: 3, title: 'Criterios de aceptación y falla', content: 'La prueba se aprueba si: la presión no cae más del 1% en la última hora de prueba (corregido por temperatura), no hay fugas visibles en fittings ni cuerpo de tubería, no hay deformaciones permanentes. Ante una falla: despresurizar, localizar y reparar, re-probar con procedimiento completo.' },
        ],
      },
      {
        order: 6, sharedQuizGroup: 3, passingScore: 70, isPremium: false,
        title: 'Amenazas y Mecanismos de Daño en RTP',
        description: 'Identificación y gestión de amenazas que afectan la integridad del RTP en servicio.',
        lessons: [
          { order: 1, title: 'Amenazas mecánicas', content: 'Daño por terceros: impacto de excavación o maquinaria. Daño por sobre-flexión: exceder el radio mínimo de curvatura. Colapso por vacío: presión negativa en sistemas de elevación. Cada amenaza mecánica tiene protocolos de inspección y mitigación específicos.' },
          { order: 2, title: 'Amenazas químicas y ambientales', content: 'Permeación de hidrocarburos: especialmente en sistemas de gas. Degradación UV: en tubería expuesta sin protección. Abrasión interna: en fluidos con sólidos en suspensión. La selección correcta del liner minimiza el riesgo químico.' },
          { order: 3, title: 'Evaluación y gestión del riesgo', content: 'Aplicar matriz de probabilidad vs consecuencia para cada amenaza identificada. Definir controles: inspección visual, medición de presión de operación, uso de inhibidores. Documentar todas las amenazas en el Plan de Gestión de Integridad (IMP).' },
        ],
      },
      {
        order: 7, sharedQuizGroup: 4, passingScore: 70, isPremium: false,
        title: 'Plan de Gestión de Integridad (IMP)',
        description: 'Diseño e implementación del Integrity Management Plan para sistemas de RTP según mejores prácticas de la industria.',
        lessons: [
          { order: 1, title: '¿Qué es un IMP para RTP?', content: 'El Integrity Management Plan es el documento rector que define cómo identificar, evaluar, mitigar y monitorear las amenazas al sistema de tuberías a lo largo de su vida útil. Incluye: inventario de activos, evaluación de riesgos, programa de inspección, criterios de respuesta y registros históricos.' },
          { order: 2, title: 'Elementos clave del IMP', content: 'Sección 1: Identificación del sistema (trazado, materiales, fluido, condiciones de operación). Sección 2: Evaluación de amenazas y riesgos. Sección 3: Plan de inspección y monitoreo. Sección 4: Procedimientos de respuesta a emergencias. Sección 5: Programa de capacitación del personal.' },
          { order: 3, title: 'Indicadores de desempeño (KPIs)', content: 'KPIs típicos del IMP: número de fugas por km-año, tiempo promedio de respuesta a emergencias, porcentaje de inspecciones completadas en el plazo, número de incidentes por interferencia de terceros. Revisión anual del IMP con actualización de hallazgos.' },
        ],
      },
      {
        order: 8, sharedQuizGroup: 4, passingScore: 70, isPremium: false,
        title: 'Inspección en Servicio y API 15SA',
        description: 'Técnicas de inspección en servicio del RTP y aplicación de la norma API 15SA para sistemas de gathering.',
        lessons: [
          { order: 1, title: 'API 15SA: Alcance y aplicación', content: 'API Specification 15SA cubre tubería termoplástica reforzada para servicio de recolección de petróleo y gas (gathering). Define requisitos de diseño, materiales, pruebas de fábrica y marcado. Es la norma de referencia para especificar y aceptar RTP en proyectos de upstream.' },
          { order: 2, title: 'Métodos de inspección en servicio', content: 'Inspección visual: revisión periódica del derecho de vía y exposiciones. Monitoreo de presión: tendencias de presión en puntos clave. Smart pigging (limitado en RTP): se usa en diámetros >4" con herramientas específicas para termoplásticos. Prueba hidrostática periódica: según frecuencia definida en el IMP.' },
          { order: 3, title: 'Criterios de reparación y retiro de servicio', content: 'Daño mayor al 10% del espesor de pared → evaluación de FFS o retiro de servicio. Fuga activa → despresurización inmediata y reparación con clamp o sección nueva. Deformación permanente visible → evaluación estructural. Todos los eventos de integridad deben reportarse y documentarse en el IMP.' },
        ],
      },
      {
        order: 9, sharedQuizGroup: undefined, passingScore: 85, isPremium: true,
        title: 'API 17J — RTP para Aplicaciones Offshore',
        description: 'Módulo premium: diseño, certificación y operación de RTP según API 17J para ambientes marinos y offshore.',
        lessons: [
          { order: 1, title: 'API 17J: Contexto y diferencias con API 15S', content: 'API Specification 17J cubre líneas de flujo flexibles (flexible flowlines) en ambiente submarino y offshore. A diferencia del RTP terrestre, los sistemas offshore deben resistir: presión hidrostática externa (hasta 3000 m), cargas dinámicas por oleaje y corriente, temperatura reducida del fondo marino y corrosión marina acelerada.' },
          { order: 2, title: 'Diseño estructural de líneas flexibles offshore', content: 'Las líneas flexibles offshore tienen arquitecturas de hasta 8 capas: capa anti-desgaste, capa de presión helicoidal, armaduras de tracción, capa de sellado exterior. El análisis de fatiga es obligatorio. Se requiere certificación de tercera parte (DNV, Bureau Veritas) para instalación offshore.' },
          { order: 3, title: 'Instalación y operación submarina', content: 'La instalación submarina utiliza ROVs y barcos de tendido especializados (laying vessels). Se realizan pruebas de aceptación en fábrica (FAT), pruebas de sistema integrado (ISIT) y pruebas de pre-comisionamiento in-situ. El monitoreo incluye medición de contenido de gas en el anular y análisis de vibración inducida por flujo.' },
        ],
      },
    ];

    const quizData: Record<number, QuizSeed> = {
      1: {
        title: 'Quiz Compartido: Anatomía y Logística del RTP',
        questions: [
          { questionText: '¿Cuántas capas tiene típicamente un RTP estándar?', options: ['1 capa', '2 capas', '3 capas', '5 capas'], correctAnswer: 2, explanation: 'El RTP está compuesto por 3 capas: liner interior, refuerzo y capa exterior protectora.' },
          { questionText: '¿Cuál es el material más común del liner interior del RTP?', options: ['PVC', 'HDPE o XLPE', 'Acero al carbono', 'Fibra de vidrio'], correctAnswer: 1, explanation: 'El liner es generalmente HDPE o XLPE, seleccionado según el fluido transportado.' },
          { questionText: '¿Cuál es la presión de trabajo típica del RTP?', options: ['1-5 bar', '10-20 bar', '40-100 bar', '200-500 bar'], correctAnswer: 2, explanation: 'El RTP opera típicamente entre 40 y 100 bar dependiendo del diámetro y construcción.' },
          { questionText: '¿Cuál es el radio de curvatura mínimo del RTP?', options: ['3x el diámetro', '5x el diámetro', '10x el diámetro', '20x el diámetro'], correctAnswer: 2, explanation: 'El radio mínimo es generalmente 10 veces el diámetro exterior.' },
          { questionText: '¿Qué se debe verificar en la inspección de recepción?', options: ['Solo el número de lote', 'Lote, longitud, ausencia de daño, tapones', 'Solo la longitud del carrete', 'Solo el color de la tubería'], correctAnswer: 1, explanation: 'La inspección de recepción debe incluir: número de lote, longitud, estado visual y presencia de tapones.' },
          { questionText: '¿Cómo deben transportarse los carretes de RTP?', options: ['Verticalmente', 'Horizontalmente y asegurados', 'Apilados sin restricción', 'En posición diagonal'], correctAnswer: 1, explanation: 'Los carretes deben transportarse horizontalmente y correctamente asegurados.' },
          { questionText: '¿Cuánto tiempo máximo puede almacenarse el RTP al sol sin cubierta?', options: ['Sin límite', '1 año', '30 días', '7 días'], correctAnswer: 2, explanation: 'Más de 30 días bajo sol directo requiere cubrir los carretes para proteger el material.' },
          { questionText: '¿Cuál es la principal ventaja del RTP sobre la tubería de acero?', options: ['Mayor resistencia a la temperatura', 'Menor peso (1/4) y resistencia a la corrosión', 'Mayor presión de trabajo', 'Más fácil de soldar'], correctAnswer: 1, explanation: 'El RTP pesa aproximadamente 1/4 que el acero equivalente y no requiere protección anticorrosiva interna.' },
          { questionText: '¿Qué tipo de fibra se usa habitualmente como refuerzo en el RTP?', options: ['Algodón', 'Aramida, fibra de vidrio o acero', 'Nylon', 'Polipropileno'], correctAnswer: 1, explanation: 'El refuerzo usa fibras de alta resistencia: aramida, fibra de vidrio o alambres de acero.' },
          { questionText: '¿Qué temperatura máxima de operación tiene el RTP estándar?', options: ['20°C', '45°C', '65°C', '120°C'], correctAnswer: 2, explanation: 'El límite típico es +65°C para RTP estándar con liner de HDPE.' },
        ],
      },
      2: {
        title: 'Quiz Compartido: Instalación y Fusión del RTP',
        questions: [
          { questionText: '¿Cuál es el ancho mínimo de zanja para instalar RTP?', options: ['DO + 100 mm', 'DO + 300 mm', 'DO + 500 mm', '2x el diámetro'], correctAnswer: 1, explanation: 'La zanja debe tener un ancho mínimo de DO + 300 mm.' },
          { questionText: '¿Qué espesor mínimo de cama de arena se requiere?', options: ['50 mm', '100 mm', '200 mm', '300 mm'], correctAnswer: 1, explanation: 'Se requieren 100 mm de cama de arena bajo la tubería.' },
          { questionText: '¿A qué temperatura mínima se debe tender el RTP?', options: ['0°C', '5°C', '15°C', '25°C'], correctAnswer: 1, explanation: 'El tendido debe realizarse a temperatura ambiente mayor a 5°C.' },
          { questionText: '¿Cuál es el primer paso al instalar un fitting de compresión?', options: ['Comprimir la manga', 'Corte recto del tubo', 'Insertar el insert interno', 'Limpiar el extremo'], correctAnswer: 1, explanation: 'El primer paso es el corte recto del tubo usando sierra mecánica.' },
          { questionText: '¿Qué herramienta se debe usar para el corte del RTP?', options: ['Amoladora angular', 'Sierra mecánica', 'Cuchillo de campo', 'Disco de corte abrasivo'], correctAnswer: 1, explanation: 'Se debe usar una sierra mecánica para obtener un corte recto y limpio.' },
          { questionText: '¿Qué norma valida el procedimiento de fitting para RTP?', options: ['ASME B31.4', 'API 15S', 'ISO 9001', 'ASTM D638'], correctAnswer: 1, explanation: 'API Specification 15S define los requisitos y pruebas de validación para fittings de RTP.' },
          { questionText: '¿Cuánto tiempo dura la prueba neumática de baja presión en fittings?', options: ['5 minutos', '15 minutos', '30 minutos', '60 minutos'], correctAnswer: 1, explanation: 'La prueba de verificación inicial de fitting se realiza a 1.5 bar durante 15 minutos.' },
          { questionText: '¿Qué profundidad mínima se requiere en cruces de caminos?', options: ['300 mm', '600 mm', '900 mm', '1200 mm'], correctAnswer: 1, explanation: 'En cruces de caminos se requiere mínimo 600 mm de cobertura.' },
          { questionText: '¿Qué se debe registrar por cada fitting instalado?', options: ['Solo el número de serial', 'Serial, fecha, operador, resultados de inspección y prueba', 'Solo el resultado de la prueba', 'Nada, no es obligatorio'], correctAnswer: 1, explanation: 'El dossier de calidad debe incluir: serial, fecha, operador, inspección visual y resultado de prueba.' },
          { questionText: '¿Cuál es la función del insert interno en el fitting de compresión?', options: ['Decorativa', 'Soporte interno para evitar colapso del tubo', 'Facilitar el desmontaje', 'Indicar la dirección del flujo'], correctAnswer: 1, explanation: 'El insert interno soporta el diámetro interior del RTP bajo la fuerza de compresión.' },
        ],
      },
      3: {
        title: 'Quiz Compartido: Prueba Hidrostática y Amenazas del RTP',
        questions: [
          { questionText: '¿Cuánto vale la presión de prueba hidrostática según API 15S?', options: ['1.0 x MAOP', '1.25 x MAOP', '1.5 x MAOP', '2.0 x MAOP'], correctAnswer: 2, explanation: 'API 15S establece que la presión de prueba hidrostática es 1.5 veces la MAOP.' },
          { questionText: '¿Cuánto tiempo debe durar la prueba hidrostática en sistemas de hasta 10 km?', options: ['1 hora', '2 horas', '4 horas', '8 horas'], correctAnswer: 2, explanation: 'La duración mínima para sistemas de hasta 10 km es 4 horas.' },
          { questionText: '¿Cuál es el criterio de aceptación de la prueba hidrostática?', options: ['Presión no cae más del 5%', 'Presión no cae más del 1% en la última hora', 'No hay criterio formal', 'La presión puede caer cualquier valor'], correctAnswer: 1, explanation: 'La presión no debe caer más del 1% en la última hora de prueba.' },
          { questionText: '¿Cuál es el primer paso de la prueba hidrostática?', options: ['Presurizar al 100%', 'Llenar con agua y purgar el aire', 'Tomar lecturas de temperatura', 'Conectar el manómetro'], correctAnswer: 1, explanation: 'El llenado completo con agua limpia y la purga de todo el aire es el primer paso crítico.' },
          { questionText: '¿Qué amenaza mecánica causa colapso por presión negativa en el RTP?', options: ['Daño por terceros', 'Sobre-flexión', 'Colapso por vacío', 'Erosión interna'], correctAnswer: 2, explanation: 'El colapso por vacío ocurre cuando la presión interna cae por debajo de la presión externa.' },
          { questionText: '¿Qué causa la degradación UV en el RTP?', options: ['Alta temperatura', 'Exposición prolongada al sol sin protección', 'Alta presión interna', 'Contacto con agua'], correctAnswer: 1, explanation: 'La exposición al sol sin protección UV degrada el polietileno con el tiempo.' },
          { questionText: '¿Qué herramienta se usa para evaluar el riesgo de amenazas?', options: ['Diagrama de Gantt', 'Matriz de probabilidad vs consecuencia', 'Diagrama de flujo', 'Lista de verificación simple'], correctAnswer: 1, explanation: 'La matriz de probabilidad vs consecuencia es la herramienta estándar para evaluar riesgos.' },
          { questionText: '¿Qué debe hacerse ante una falla durante la prueba hidrostática?', options: ['Continuar la prueba', 'Despresurizar, localizar, reparar y re-probar', 'Registrar y poner en servicio igual', 'Reducir la presión de prueba'], correctAnswer: 1, explanation: 'Ante cualquier falla: despresurizar, localizar, reparar y re-ejecutar el procedimiento completo.' },
          { questionText: '¿Cuál es la causa más común de fuga en el RTP?', options: ['Rotura del liner', 'Falla en las conexiones (fittings)', 'Corrosión del polietileno', 'Desgaste por UV'], correctAnswer: 1, explanation: 'Estadísticamente, la mayoría de las fugas ocurren en las conexiones debido a instalación incorrecta.' },
          { questionText: '¿Cuál es el rango de temperatura mínima de operación del RTP?', options: ['Solo en laboratorio', 'Mantiene flexibilidad hasta -40°C', 'No opera bajo 0°C', 'Solo con liner especial de PVC'], correctAnswer: 1, explanation: 'El polietileno mantiene su flexibilidad hasta -40°C, apto para ambientes árticos.' },
        ],
      },
      4: {
        title: 'Quiz Compartido: IMP e Inspección API 15SA',
        questions: [
          { questionText: '¿Qué documento define cómo gestionar la integridad de un sistema RTP?', options: ['Manual de instalación', 'Integrity Management Plan (IMP)', 'Plano isométrico', 'Contrato de compra'], correctAnswer: 1, explanation: 'El IMP es el documento rector de la gestión de integridad.' },
          { questionText: '¿Con qué frecuencia mínima debe revisarse el IMP?', options: ['Cada 5 años', 'Anualmente', 'Solo después de incidentes', 'Nunca'], correctAnswer: 1, explanation: 'El IMP debe revisarse y actualizarse anualmente.' },
          { questionText: '¿Qué norma cubre el RTP para aplicaciones de recolección (gathering)?', options: ['API 17J', 'API 15SA', 'ASME B31.4', 'ISO 13628'], correctAnswer: 1, explanation: 'API Specification 15SA cubre el RTP para sistemas de recolección de petróleo y gas.' },
          { questionText: '¿Cuál es el KPI más utilizado para medir la integridad de un sistema RTP?', options: ['Toneladas de fluido transportado', 'Número de fugas por km-año', 'Costo de mantenimiento', 'Velocidad del fluido'], correctAnswer: 1, explanation: 'El número de fugas por km-año es el KPI de integridad más utilizado.' },
          { questionText: '¿Qué porcentaje de daño en la pared del RTP requiere evaluación de FFS?', options: ['5%', '10%', '25%', '50%'], correctAnswer: 1, explanation: 'Un daño mayor al 10% del espesor de pared requiere evaluación de Fitness for Service.' },
          { questionText: '¿Cuál es el método preferido de inspección en servicio para el RTP?', options: ['Radiografía industrial', 'Inspección visual + monitoreo de presión', 'Prueba de dureza', 'Análisis de emisión acústica'], correctAnswer: 1, explanation: 'La inspección visual periódica y el monitoreo de tendencias de presión son el método principal.' },
          { questionText: '¿Qué acción debe tomarse ante una fuga activa?', options: ['Reducir la presión a la mitad', 'Despresurizar inmediatamente y reparar', 'Aumentar la inyección de inhibidor', 'Esperar la próxima parada programada'], correctAnswer: 1, explanation: 'Ante una fuga activa se debe despresurizar inmediatamente y proceder a la reparación.' },
          { questionText: '¿Qué sección del IMP define los procedimientos de emergencia?', options: ['Sección de inventario de activos', 'Sección de respuesta a emergencias', 'Sección de KPIs', 'Sección de capacitación'], correctAnswer: 1, explanation: 'La Sección 4 del IMP contiene los procedimientos de respuesta a emergencias.' },
          { questionText: '¿Cuál es una ventaja del smart pigging en RTP de gran diámetro?', options: ['Detecta corrosión interna', 'Verifica espesor de pared sin detener el servicio', 'Reemplaza la prueba hidrostática', 'Solo aplica a acero'], correctAnswer: 1, explanation: 'El smart pigging con herramientas para termoplásticos permite medir el espesor sin interrumpir la operación.' },
          { questionText: '¿Qué información debe incluir el informe de un evento de integridad?', options: ['Solo la fecha', 'Fecha, ubicación, causa, acción tomada y lecciones aprendidas', 'Solo el costo de reparación', 'Solo el nombre del operador'], correctAnswer: 1, explanation: 'El informe debe ser completo: fecha, ubicación, causa probable, acción, tiempo de respuesta y lecciones aprendidas.' },
        ],
      },
    };

    const premiumQuestions: QuestionSeed[] = [
      { questionText: '¿Qué norma API aplica a líneas de flujo flexibles en ambiente submarino?', options: ['API 15S', 'API 15SA', 'API 17J', 'API 6D'], correctAnswer: 2, explanation: 'API Specification 17J es la norma específica para líneas de flujo flexible en ambiente submarino.' },
      { questionText: '¿Cuántas capas puede tener una línea flexible offshore según API 17J?', options: ['3 capas', '4 capas', 'Hasta 8 capas', '12 capas'], correctAnswer: 2, explanation: 'Las líneas flexibles offshore pueden tener hasta 8 capas.' },
      { questionText: '¿Cuál es una carga exclusiva del ambiente offshore?', options: ['Presión interna del fluido', 'Presión hidrostática externa hasta 3000 m', 'Temperatura del fluido', 'Vibración mecánica'], correctAnswer: 1, explanation: 'La presión hidrostática externa debida a la columna de agua es una carga crítica exclusiva de aplicaciones submarinas.' },
      { questionText: '¿Qué organismo certifica las líneas flexibles para uso offshore?', options: ['API únicamente', 'DNV, Bureau Veritas o Lloyd\'s Register', 'Solo el fabricante', 'La empresa operadora'], correctAnswer: 1, explanation: 'La certificación de tercera parte por DNV, Bureau Veritas o Lloyd\'s Register es obligatoria.' },
      { questionText: '¿Qué equipo se usa para instalar líneas flexibles en aguas profundas?', options: ['Excavadoras terrestres', 'ROVs y laying vessels especializados', 'Grúas convencionales', 'Helicópteros de carga'], correctAnswer: 1, explanation: 'Los ROVs y los barcos de tendido especializados son los equipos estándar.' },
      { questionText: '¿Qué prueba se realiza en fábrica antes de enviar la línea offshore?', options: ['Prueba visual únicamente', 'Factory Acceptance Test (FAT)', 'Prueba de fusión', 'Análisis de materiales'], correctAnswer: 1, explanation: 'El FAT es una prueba completa realizada en fábrica incluyendo prueba hidrostática y tracción.' },
      { questionText: '¿Qué análisis es obligatorio para líneas flexibles offshore?', options: ['Análisis de costo', 'Análisis de fatiga', 'Análisis de mercado', 'Análisis de producción'], correctAnswer: 1, explanation: 'El análisis de fatiga es obligatorio debido a las cargas cíclicas dinámicas.' },
      { questionText: '¿Qué indica la permeación de gas en el anular de una línea flexible?', options: ['Operación normal', 'Posible daño o degradación del liner', 'Mayor eficiencia de transporte', 'Necesidad de más inhibidor'], correctAnswer: 1, explanation: 'La permeación de gas al anular puede indicar degradación del liner o una fisura incipiente.' },
      { questionText: '¿Qué prueba se realiza in-situ antes de poner en operación?', options: ['Prueba de impacto', 'Integrated System Installation Test (ISIT)', 'Análisis de aceite', 'Prueba de vibración'], correctAnswer: 1, explanation: 'El ISIT verifica la integridad del sistema completo antes del inicio de la producción.' },
      { questionText: '¿Cuál es la profundidad máxima típica de operación offshore de alta especificación?', options: ['100 m', '500 m', '3000 m', '10000 m'], correctAnswer: 2, explanation: 'Las líneas flexibles de alta especificación según API 17J pueden operar hasta 3000 m de profundidad.' },
    ];

    // ── INSERT DATA ───────────────────────────────────────────────────────────
    for (const modData of modulesData) {
      const { lessons, ...moduleFields } = modData;

      const moduleToSave: Partial<ModuleEntity> = {
        order: moduleFields.order,
        title: moduleFields.title,
        description: moduleFields.description,
        isPremium: moduleFields.isPremium,
        passingScore: moduleFields.passingScore,
        sharedQuizGroup: moduleFields.sharedQuizGroup ?? undefined,
      };

      const savedModule = await this.modulesRepo.save(
        this.modulesRepo.create(moduleToSave),
      );
      this.logger.log(`  ✅ Módulo ${savedModule.order}: ${savedModule.title}`);

      for (const lessonData of lessons) {
        await this.lessonsRepo.save(
          this.lessonsRepo.create({ ...lessonData, moduleId: savedModule.id }),
        );
      }

      const group = moduleFields.sharedQuizGroup;
      if (group !== undefined && quizData[group]) {
        const existingQuiz = await this.quizzesRepo.findOne({
          where: { moduleId: savedModule.id },
        });
        if (!existingQuiz) {
          const qd = quizData[group];
          const savedQuiz = await this.quizzesRepo.save(
            this.quizzesRepo.create({ title: qd.title, moduleId: savedModule.id }),
          );
          for (const q of qd.questions) {
            await this.questionsRepo.save(
              this.questionsRepo.create({ ...q, quizId: savedQuiz.id }),
            );
          }
          this.logger.log(`    📝 Quiz "${qd.title}" (${qd.questions.length} preguntas)`);
        }
      } else if (group === undefined && savedModule.order === 9) {
        const savedQuiz = await this.quizzesRepo.save(
          this.quizzesRepo.create({
            title: 'Evaluación Premium: API 17J Offshore',
            moduleId: savedModule.id,
          }),
        );
        for (const q of premiumQuestions) {
          await this.questionsRepo.save(
            this.questionsRepo.create({ ...q, quizId: savedQuiz.id }),
          );
        }
        this.logger.log(
          `    📝 Quiz Premium: API 17J con ${premiumQuestions.length} preguntas (umbral ${savedModule.passingScore}%)`,
        );
      }
    }

    this.logger.log('✅ Seed completado exitosamente');
    return { message: 'Seed ejecutado', modules: modulesData.length };
  }
}
