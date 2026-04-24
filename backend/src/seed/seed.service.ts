import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module as ModuleEntity } from '../entities/module.entity';
import { Lesson } from '../entities/lesson.entity';
import { Quiz } from '../entities/quiz.entity';
import { Question } from '../entities/question.entity';

interface LessonSeed { order: number; title: string; content: string; }
interface QuestionSeed { questionText: string; options: string[]; correctAnswer: number; explanation: string; }
interface ModuleSeed {
  order: number; title: string; description: string; isPremium: boolean; passingScore: number;
  lessons: LessonSeed[];
  quiz: { title: string; questions: QuestionSeed[] };
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

  /**
   * Detects stale (old) seed data by checking module titles.
   * Old modules had generic titles like "Anatomía del RTP".
   * New modules have API-norm-specific titles.
   * Runs reset + reseed automatically on first deploy with new code.
   */
  async autoMigrateIfStale() {
    const count = await this.modulesRepo.count();
    if (count === 0) {
      this.logger.log('DB vacía — ejecutando seed inicial...');
      return this.runSeed();
    }
    // Check if the first module has the old title (old seed)
    const firstModule = await this.modulesRepo.findOne({ where: { order: 1 } });
    const expectedTitle = 'Fundamentos del RTP — Alcance y Clasificación API 15S';
    if (firstModule && firstModule.title !== expectedTitle) {
      this.logger.log(`⚠️  Seed desactualizado detectado (título: "${firstModule.title}"). Migrando a contenido técnico API...`);
      return this.reset();
    }
    this.logger.log('✅ Seed actualizado — no se requiere migración.');
  }

  async reset() {
    this.logger.log('Resetting seed: eliminando módulos, lecciones, quizzes y preguntas...');
    // Delete in dependency order
    await this.questionsRepo.query('DELETE FROM "questions"');
    await this.quizzesRepo.query('DELETE FROM "quizzes"');
    await this.lessonsRepo.query('DELETE FROM "lessons"');
    await this.modulesRepo.query('DELETE FROM "modules"');
    this.logger.log('Reset completado. Ejecutando seed...');
    return this.runSeed();
  }

  async run() {
    const count = await this.modulesRepo.count();
    if (count > 0) {
      this.logger.log('Seed ya ejecutado. Omitiendo...');
      return { message: 'Seed ya ejecutado previamente. Usa /seed/reset para reiniciar.' };
    }
    return this.runSeed();
  }

  private async runSeed() {
    this.logger.log('Iniciando seed técnico — 9 módulos API 15S / 15SA / 15SIH / 17J...');

    const modules: ModuleSeed[] = [
      {
        order: 1, isPremium: false, passingScore: 70,
        title: 'Fundamentos del RTP — Alcance y Clasificación API 15S',
        description: 'Alcance, clasificación de servicio y requisitos generales de API Spec 15S para tubería termoplástica reforzada spoolable en petróleo y gas.',
        lessons: [
          { order: 1, title: 'Alcance y campo de aplicación de API 15S',
            content: 'API Specification 15S (Spoolable Reinforced Plastic Line Pipe) cubre tubería termoplástica reforzada (RTP) para transporte de fluidos en la industria de petróleo y gas. Se aplica a tuberías con presión de trabajo hasta 3500 psi (241 bar) y diámetros nominales de ½" a 4" (DN 15 a DN 100). La norma define requisitos de diseño, materiales, fabricación, ensayos de tipo, inspección y documentación. Es una especificación de producto del fabricante, no una norma de instalación. Las prácticas de instalación se abordan en documentos complementarios como API RP 15S.' },
          { order: 2, title: 'Clasificación de RTP por clase de servicio',
            content: 'API 15S clasifica el RTP según el servicio:\n\nClase A (servicio no corrosivo): fluidos sin H₂S, CO₂ libre ni agua en concentraciones agresivas al polietileno.\nClase B (servicio corrosivo): fluidos con H₂S ≤ 1 mol% y/o CO₂, donde el liner debe ser resistente a degradación química.\nServicio de alta temperatura: cuando T > 60 °C se aplica factor de desclasificación de temperatura (TDF) validado por ensayo.\n\nCada combinación diámetro-presión-temperatura-clase de servicio requiere calificación de tipo independiente. Los certificados de producto deben indicar explícitamente la clase de servicio calificada.' },
          { order: 3, title: 'Componentes estructurales y materiales calificados',
            content: 'Un RTP según API 15S está compuesto por tres capas funcionales:\n\n1. Liner interior (capa de transporte de fluido): polietileno de alta densidad (HDPE PE-80 o PE-100) o polietileno reticulado (XLPE), cumpliendo ASTM D3350. Es el elemento hermético en contacto con el fluido.\n\n2. Capa de refuerzo estructural: fibras de aramida (Kevlar®), fibra de vidrio E o S, o alambres de acero trefilado de alta resistencia. El ángulo de enrollado y número de capas determinan la presión nominal del producto.\n\n3. Jacket exterior protector: HDPE o MDPE con Carbon Black ≥ 2% o estabilizadores HALS para protección UV. Protege contra daño mecánico y abrasión.\n\nCualquier cambio en formulación, proveedor de fibra o parámetro de proceso requiere re-calificación de tipo completa.' },
        ],
        quiz: {
          title: 'Evaluación M1 — Fundamentos y Clasificación API 15S',
          questions: [
            { questionText: '¿Cuál es la presión máxima de trabajo que cubre API Spec 15S?', options: ['1000 psi (69 bar)', '2000 psi (138 bar)', '3500 psi (241 bar)', '5000 psi (345 bar)'], correctAnswer: 2, explanation: 'API 15S cubre RTP hasta 3500 psi (241 bar) de presión de trabajo nominal.' },
            { questionText: '¿Qué rango de diámetros nominales cubre API 15S?', options: ['¼" a 2"', '½" a 4" (DN 15 a DN 100)', '2" a 8"', '1" a 12"'], correctAnswer: 1, explanation: 'La norma aplica a diámetros nominales de ½" a 4" (DN 15 a DN 100).' },
            { questionText: '¿Qué distingue al RTP Clase B según API 15S?', options: ['Mayor presión nominal', 'Servicio con H₂S ≤ 1 mol% y/o CO₂ (servicio corrosivo)', 'Uso exclusivo offshore', 'Diámetro superior a 4"'], correctAnswer: 1, explanation: 'Clase B es para servicio corrosivo con H₂S ≤ 1 mol% y/o CO₂, a diferencia de Clase A que es servicio no corrosivo.' },
            { questionText: '¿Cuál es la función principal del liner interior de HDPE?', options: ['Soportar carga axial de tensión', 'Garantizar hermeticidad y resistencia química al fluido', 'Proteger contra UV externo', 'Aportar rigidez estructural'], correctAnswer: 1, explanation: 'El liner de HDPE/XLPE es el elemento hermético en contacto con el fluido, garantiza hermeticidad y resistencia química.' },
            { questionText: '¿Qué norma rige las propiedades del liner de polietileno en RTP API 15S?', options: ['ISO 1183', 'ASTM D3350', 'ASME B31.4', 'NACE MR0175'], correctAnswer: 1, explanation: 'ASTM D3350 establece las propiedades y clasificación del polietileno para liner en RTP.' },
            { questionText: '¿Qué porcentaje mínimo de Carbon Black debe tener el jacket exterior para protección UV?', options: ['0.5%', '1%', '2%', '5%'], correctAnswer: 2, explanation: 'El jacket de HDPE/MDPE debe contener ≥ 2% de Carbon Black para protección adecuada contra degradación UV.' },
            { questionText: '¿Qué parámetro del refuerzo determina la presión nominal del RTP?', options: ['Color de la fibra', 'Ángulo de enrollado y número de capas de refuerzo', 'Espesor del jacket', 'Temperatura de extrusión'], correctAnswer: 1, explanation: 'El ángulo de enrollado helicoidal y el número de capas de refuerzo determinan la capacidad de presión del producto.' },
            { questionText: '¿Cuándo se requiere re-calificación de tipo de un producto RTP?', options: ['Solo al cambiar el diámetro', 'Ante cualquier cambio en formulación, proveedor de fibra o parámetro de proceso', 'Solo al cambiar el país de fabricación', 'Cada 5 años sin excepción'], correctAnswer: 1, explanation: 'Cualquier cambio en materiales o proceso de fabricación requiere re-calificación de tipo completa según API 15S.' },
            { questionText: '¿API 15S es una norma de instalación o una especificación de producto?', options: ['Norma de instalación en campo', 'Especificación de producto del fabricante', 'Norma de gestión de integridad', 'Estándar de ensayo de laboratorio'], correctAnswer: 1, explanation: 'API 15S es una especificación de producto. Las prácticas de instalación se cubren en documentos complementarios como API RP 15S.' },
            { questionText: '¿Cuál de los siguientes materiales de refuerzo NO está contemplado en API 15S?', options: ['Fibra de aramida', 'Fibra de vidrio E o S', 'Alambre de acero trefilado', 'Fibra de carbono sin calificación en la norma'], correctAnswer: 3, explanation: 'API 15S califica aramida, fibra de vidrio y alambre de acero. La fibra de carbono no está incluida como material de refuerzo estándar.' },
          ],
        },
      },
      {
        order: 2, isPremium: false, passingScore: 70,
        title: 'Diseño y Calificación de Producto — API 15S',
        description: 'Metodología de diseño, factores de diseño, ensayos de tipo requeridos y criterios de calificación del fabricante según API Spec 15S.',
        lessons: [
          { order: 1, title: 'Presión nominal y factores de diseño',
            content: 'API 15S utiliza la Presión de Trabajo Nominal (NWP) como presión máxima de servicio continuo a 23 °C. La presión de ráfaga mínima (MBP) debe ser ≥ 4 × NWP (factor de diseño = 0.25).\n\nCuando la temperatura supera 23 °C, se aplica el Factor de Desclasificación de Temperatura (TDF) determinado por el fabricante mediante ensayo. Ejemplo: a 60 °C el TDF típico para HDPE liner es 0.63 → NWP a 60 °C = NWP × 0.63.\n\nLa presión hidrostática de prueba de campo (FHTP) = 1.25 × NWP para sistemas nuevos instalados.' },
          { order: 2, title: 'Ensayos de tipo (Type Testing) requeridos por API 15S',
            content: 'La calificación bajo API 15S requiere:\n\n• Ensayo de presión a corto plazo: determinar MBP a 23 °C en 5 muestras. Ninguna falla antes de 4 × NWP.\n• Ensayo LTHS (Long Term Hydrostatic Strength): regresión estadística según ISO/TR 9080 a 20 °C y 60 °C, proyección 20 años → obtener HDB (Hydrostatic Design Basis).\n• Ensayo de flexión a temperatura: curvado al MBR a -20 °C y +60 °C sin fractura ni deslaminación.\n• Ensayo de tensión axial: tracción hasta falla del sistema fitting-tubería → determinar MTAL.\n• Ensayo de presión cíclica: 100,000 ciclos entre 0 y NWP a temperatura máxima de servicio, sin fuga.\n• Ensayo de colapso: para tuberías con posibilidad de presión externa.' },
          { order: 3, title: 'Documentación de calificación y marcado del producto',
            content: 'Cada producto RTP calificado bajo API 15S debe contar con:\n\nProduct Data Sheet (PDS): declara NWP, MBR, MTAL, rango de temperatura, clase de servicio, diámetro interior/exterior, masa por metro y tablas TDF.\n\nMarcado permanente del tubo (mínimo):\n• Nombre o marca del fabricante\n• Número de serie o lote de producción\n• Diámetro nominal\n• NWP a 23 °C\n• Año de fabricación\n• Identificación de conformidad API 15S\n\nCertificado de inspección (Mill Certificate): emitido por lote con resultados de QC: presión de prueba de producción, dimensiones y trazabilidad de materiales.' },
        ],
        quiz: {
          title: 'Evaluación M2 — Diseño y Calificación API 15S',
          questions: [
            { questionText: '¿Cuál es el factor de diseño (MBP/NWP) mínimo de API 15S?', options: ['2.0', '2.5', '4.0', '6.0'], correctAnswer: 2, explanation: 'API 15S requiere MBP ≥ 4 × NWP, lo que equivale a un factor de diseño de 0.25.' },
            { questionText: '¿A qué temperatura de referencia se define la NWP según API 15S?', options: ['0 °C', '23 °C', '40 °C', '60 °C'], correctAnswer: 1, explanation: 'La NWP se define a la temperatura de referencia de 23 °C.' },
            { questionText: '¿Qué metodología usa API 15S para proyección de vida útil a largo plazo?', options: ['ASME VIII Div.1', 'ISO/TR 9080 (regresión estadística LTHS)', 'NACE TM0177', 'ASTM E8'], correctAnswer: 1, explanation: 'ISO/TR 9080 define el método de regresión estadística para determinar el HDB a largo plazo.' },
            { questionText: 'Si NWP = 100 bar a 23 °C y TDF a 60 °C = 0.63, ¿cuál es la presión de trabajo a 60 °C?', options: ['37 bar', '63 bar', '100 bar', '159 bar'], correctAnswer: 1, explanation: 'Presión a 60 °C = NWP × TDF = 100 × 0.63 = 63 bar.' },
            { questionText: '¿Cuántos ciclos requiere el ensayo de presión cíclica de API 15S?', options: ['10,000', '50,000', '100,000', '1,000,000'], correctAnswer: 2, explanation: 'El ensayo de presión cíclica requiere 100,000 ciclos entre 0 y NWP sin fuga ni falla.' },
            { questionText: '¿Qué ensayo determina la carga axial máxima del sistema fitting-tubería?', options: ['Ensayo LTHS', 'Ensayo de colapso', 'Ensayo de tensión axial (MTAL)', 'Ensayo de presión cíclica'], correctAnswer: 2, explanation: 'El ensayo de tensión axial determina la Maximum Tensile Axial Load (MTAL) del sistema fitting-tubería.' },
            { questionText: '¿A qué temperaturas se realiza el ensayo de flexión de API 15S?', options: ['Solo a 23 °C', 'A 0 °C y 40 °C', 'A -20 °C y +60 °C', 'A -40 °C y +80 °C'], correctAnswer: 2, explanation: 'El ensayo de flexión se realiza a -20 °C (mínima operacional) y +60 °C (máxima típica), al MBR del fabricante.' },
            { questionText: '¿Qué significa MBR en la ficha técnica de un RTP?', options: ['Maximum Burst Rating', 'Minimum Bend Radius (radio mínimo de curvatura)', 'Maximum Bore Ratio', 'Minimum Breaking Resistance'], correctAnswer: 1, explanation: 'MBR = Minimum Bend Radius, el radio mínimo al que puede curvarse el RTP sin daño estructural.' },
            { questionText: '¿Cuál es la FHTP para sistemas nuevos instalados según las recomendaciones de API 15S?', options: ['1.0 × NWP', '1.25 × NWP', '1.5 × NWP', '2.0 × NWP'], correctAnswer: 1, explanation: 'FHTP = 1.25 × NWP para sistemas nuevos instalados según práctica recomendada.' },
            { questionText: '¿Qué declara el Product Data Sheet (PDS) de un RTP API 15S?', options: ['Solo el precio y el plazo de entrega', 'NWP, MBR, MTAL, rango de temperatura, clase de servicio y tablas TDF', 'Solo el diámetro y la longitud del carrete', 'Solo los resultados del Mill Certificate'], correctAnswer: 1, explanation: 'El PDS es el documento técnico del fabricante que declara todos los parámetros de desempeño calificados del producto.' },
          ],
        },
      },
      {
        order: 3, isPremium: false, passingScore: 70,
        title: 'Fittings y Sistemas de Unión para RTP — API 15S',
        description: 'Tipos de conectores calificados, requisitos de diseño de fittings, procedimientos de instalación y control de calidad de uniones en sistemas RTP.',
        lessons: [
          { order: 1, title: 'Clasificación y tipos de fittings calificados',
            content: 'API 15S requiere que todos los fittings sean calificados como parte del sistema tubería-fitting. Los tipos principales son:\n\n• Fitting de compresión mecánica (Mechanical Grip Fitting): sujeción sobre la capa exterior con insert interno (stiffener) de aluminio o acero para soportar el liner. Es el tipo más usado en campo, no requiere equipo especial.\n• Fitting termosoldado (Electrofusion): disponible solo para RTP con liner PE. Unión mediante resistencia eléctrica embebida. Requiere equipo homologado y condiciones de limpieza estrictas.\n• Fitting roscado (NPT/BSPT): para conexiones a manifolds, válvulas y equipos con rosca estándar.\n• Fitting bridado (ASME B16.5): para conexiones a bridas de acero. El extremo lleva adaptador de brida calificado por el fabricante.' },
          { order: 2, title: 'Calificación del sistema fitting-tubería',
            content: 'La calificación del sistema fitting-tubería requiere:\n\n• Ensayo de presión a corto plazo: 1.5 × NWP durante 1 hora sin fuga, con el fitting instalado según el procedimiento exacto del fabricante.\n• Ensayo de carga axial (MTAL): el conjunto debe soportar la carga axial máxima sin separación ni fuga.\n• Ensayo de presión a largo plazo: hermeticidad a 1.0 × NWP durante 1000 horas sin fuga.\n\nEl fabricante debe proveer el Fitting Installation Procedure (FIP) detallado con torques, longitudes de inserción y herramientas requeridas. El FIP es parte del certificado de calificación del sistema.' },
          { order: 3, title: 'Procedimiento de instalación de fitting de compresión en campo',
            content: 'Pasos críticos del FIP para fitting de compresión mecánica:\n\n1. Corte: sierra de cinta o sierra circular con guía. NUNCA amoladora angular. Perpendicular al eje (desviación máx. ±1°).\n2. Preparación: limpiar con paño limpio y alcohol isopropílico. Eliminar rebabas.\n3. Inserción del stiffener: hasta el tope marcado. Verificar que el extremo del tubo llegue al hombro del fitting.\n4. Compresión: aplicar con herramienta hidráulica calificada a la presión y número de golpes especificados en tabla del fabricante según diámetro.\n5. Verificación y registro: inspección visual de la mordaza, medición de distancia de inserción, registro en dossier de calidad (número de fitting, operador, fecha, hora, resultado).' },
        ],
        quiz: {
          title: 'Evaluación M3 — Fittings y Conexiones RTP',
          questions: [
            { questionText: '¿Qué función cumple el stiffener en un fitting de compresión para RTP?', options: ['Aumentar la presión de compresión', 'Soportar el diámetro interior del liner durante la compresión', 'Conectar eléctricamente el refuerzo', 'Facilitar el desmontaje'], correctAnswer: 1, explanation: 'El stiffener (insert interno) soporta el liner para evitar que colapse bajo la fuerza de compresión del fitting.' },
            { questionText: '¿Cuál es el criterio de ensayo de presión a corto plazo del sistema fitting-tubería API 15S?', options: ['1.0 × NWP, 30 min', '1.25 × NWP, 2 horas', '1.5 × NWP, 1 hora sin fuga', '2.0 × NWP, 15 min'], correctAnswer: 2, explanation: 'La calificación requiere 1.5 × NWP durante 1 hora sin fuga con el fitting instalado según FIP del fabricante.' },
            { questionText: '¿Qué herramienta está PROHIBIDA para el corte del RTP?', options: ['Sierra de cinta', 'Sierra circular con guía', 'Amoladora angular', 'Sierra reciprocante'], correctAnswer: 2, explanation: 'La amoladora genera calor que daña el liner y produce corte irregular; está prohibida por los FIPs de fabricantes.' },
            { questionText: '¿Cuánto tiempo dura el ensayo de presión a largo plazo del sistema fitting-tubería?', options: ['100 horas', '500 horas', '1000 horas', '8760 horas'], correctAnswer: 2, explanation: 'El ensayo a largo plazo requiere hermeticidad a 1.0 × NWP durante 1000 horas sin fuga.' },
            { questionText: '¿Qué norma aplica a las bridas de acero usadas con fittings bridados de RTP?', options: ['ISO 4633', 'ASME B16.5', 'API 6A', 'DIN 2501'], correctAnswer: 1, explanation: 'Los fittings bridados de RTP se conectan a bridas según ASME B16.5, norma estándar para bridas de tuberías en la industria.' },
            { questionText: '¿Qué desviación máxima se permite en el corte del extremo del RTP?', options: ['±0.5°', '±1°', '±5°', '±10°'], correctAnswer: 1, explanation: 'El corte debe ser perpendicular al eje con desviación máxima de ±1° para garantizar el asiento correcto del fitting.' },
            { questionText: '¿Qué ensayo verifica la integridad del fitting bajo fuerzas de tracción?', options: ['Ensayo LTHS', 'Ensayo de carga axial (MTAL)', 'Ensayo de presión cíclica', 'Ensayo de colapso'], correctAnswer: 1, explanation: 'El ensayo MTAL verifica que el conjunto fitting-tubería no se separe bajo la máxima carga axial de diseño.' },
            { questionText: '¿Qué tipo de fitting requiere equipo homologado y control estricto de limpieza?', options: ['Fitting de compresión mecánica', 'Fitting termosoldado (electrofusión)', 'Fitting roscado NPT', 'Fitting bridado ASME B16.5'], correctAnswer: 1, explanation: 'El fitting de electrofusión requiere equipo homologado y condiciones de temperatura y limpieza controladas.' },
            { questionText: '¿Qué información mínima debe registrarse por cada fitting en el dossier de calidad?', options: ['Solo el número de serie', 'Número de fitting, operador, fecha, hora y resultado de inspección', 'Solo el torque aplicado', 'Solo la presión de prueba'], correctAnswer: 1, explanation: 'El dossier debe incluir: número de fitting, operador certificado, fecha, hora y resultado de inspección visual.' },
            { questionText: '¿Qué documento del fabricante rige el procedimiento de instalación del fitting de compresión?', options: ['Product Data Sheet (PDS)', 'Mill Certificate', 'Fitting Installation Procedure (FIP)', 'Safety Data Sheet (SDS)'], correctAnswer: 2, explanation: 'El FIP (Fitting Installation Procedure) es el documento normativo del fabricante que especifica cada paso, torque y herramienta.' },
          ],
        },
      },
      {
        order: 4, isPremium: false, passingScore: 70,
        title: 'Instalación en Campo y Prueba Hidrostática — API RP 15S',
        description: 'Procedimientos de manejo, zanjeo, tendido y prueba hidrostática de sistemas RTP instalados según API RP 15S.',
        lessons: [
          { order: 1, title: 'Manejo, transporte y almacenamiento de carretes RTP',
            content: 'Errores en el manejo son la principal causa de daño antes de la instalación:\n\n• Transporte: horizontal sobre superficie plana. Cintas de amarre (nunca cables metálicos). Radio de enrollado en carrete ≥ MBR del producto.\n• Izaje: eslingas textiles de 4 puntos. Nunca una sola eslinga central (genera flexión concentrada).\n• Almacenamiento: superficie nivelada sin piedras agudas ni contaminantes. Si almacenamiento > 30 días a la intemperie: cubrir con manta opaca. No apilar > 2 carretes sin soporte estructural. Temperatura máx. de almacenamiento: 50 °C.' },
          { order: 2, title: 'Zanjeo, tendido y curvado en campo',
            content: 'Requisitos de zanja para RTP:\n\n• Ancho mínimo: DN + 300 mm (recomendado DN + 400 mm para facilitar instalación de fittings en zanja).\n• Cama de arena: arena limpia (< 3 mm) de 100 mm mínimo bajo la generatriz inferior. Elimina cargas concentradas sobre el refuerzo.\n• Cobertura mínima: 600 mm en tierra agrícola y zonas peatonales; 900 mm en cruces de caminos no pavimentados; 1200 mm en carreteras pavimentadas o vías férreas.\n• Temperatura de tendido: > 5 °C. Por debajo, el PE pierde flexibilidad y puede agrietarse al curvar.\n• Curvado en frío: nunca inferior al MBR. Para curvas más cerradas usar codos fabricados. Nunca aplicar calor local.' },
          { order: 3, title: 'Procedimiento de prueba hidrostática de campo',
            content: 'Procedimiento según API RP 15S:\n\n1. Llenado y purga de aire: llenar con agua limpia. Purgar completamente abriendo venteos en puntos altos (el aire no purgado puede enmascarar fugas).\n2. Presurización gradual al 50% de Pt: mantener 30 min para estabilización térmica.\n3. Presurización al 100% de Pt = 1.25 × NWP.\n4. Estabilización térmica: mínimo 60 min antes de iniciar el registro oficial.\n5. Período de prueba: registro cada 15 min durante mínimo 4 horas para sistemas ≤ 10 km.\n6. Criterio de aceptación: variación de presión corregida por temperatura ≤ 1% de Pt en la última hora. Sin fugas visibles.\n7. Despresurización: lenta y controlada (riesgo de colapso del liner por vacío si se despresuriza bruscamente).' },
        ],
        quiz: {
          title: 'Evaluación M4 — Instalación y Prueba Hidrostática',
          questions: [
            { questionText: '¿Cuál es la temperatura mínima recomendada para tender RTP en campo?', options: ['0 °C', '5 °C', '15 °C', '25 °C'], correctAnswer: 1, explanation: 'Por debajo de 5 °C el polietileno pierde flexibilidad y puede agrietarse al doblar durante la instalación.' },
            { questionText: '¿Cuál es la cobertura mínima en cruce de carretera pavimentada?', options: ['600 mm', '900 mm', '1200 mm', '1500 mm'], correctAnswer: 2, explanation: 'En cruces de carreteras pavimentadas o vías férreas se requiere cobertura mínima de 1200 mm.' },
            { questionText: '¿A qué presión se realiza la prueba hidrostática de campo para sistemas RTP nuevos?', options: ['1.0 × NWP', '1.25 × NWP', '1.5 × NWP', '2.0 × NWP'], correctAnswer: 1, explanation: 'API RP 15S establece FHTP = 1.25 × NWP para sistemas instalados nuevos.' },
            { questionText: '¿Cuál es el criterio de aceptación de la prueba hidrostática de campo?', options: ['Caída máx. del 5% en 4 horas', 'Caída máx. del 1% en la última hora (corregida por temperatura)', 'Presión constante absoluta sin ninguna caída', 'Caída máx. del 2% en toda la prueba'], correctAnswer: 1, explanation: 'La variación de presión corregida por temperatura no debe superar el 1% de Pt en la última hora de prueba.' },
            { questionText: '¿Por qué es crítico purgar el aire antes de la prueba hidrostática?', options: ['Para reducir consumo de agua', 'Porque el aire comprime y puede enmascarar fugas o generar golpe de ariete', 'Para aumentar la presión de prueba', 'Porque el oxígeno oxida el fitting'], correctAnswer: 1, explanation: 'El aire atrapado comprime y puede enmascarar fugas o causar golpe de ariete al despresurizar.' },
            { questionText: '¿Cuánto tiempo mínimo de estabilización al 50% de Pt antes de continuar?', options: ['5 min', '15 min', '30 min', '60 min'], correctAnswer: 2, explanation: 'Se mantiene al 50% de Pt durante 30 minutos para estabilización térmica del sistema.' },
            { questionText: '¿Cuál es el espesor mínimo de cama de arena bajo el RTP?', options: ['50 mm', '75 mm', '100 mm', '200 mm'], correctAnswer: 2, explanation: 'Se requiere cama de arena limpia de 100 mm mínimo bajo la generatriz inferior del RTP.' },
            { questionText: '¿Cuánto dura el período de registro oficial de presión en sistemas ≤ 10 km?', options: ['1 hora', '2 horas', '4 horas', '8 horas'], correctAnswer: 2, explanation: 'Para sistemas de hasta 10 km, el período oficial de prueba es mínimo 4 horas con registro cada 15 minutos.' },
            { questionText: '¿Cómo debe izarse correctamente un carrete de RTP?', options: ['Cable de acero central', 'Una sola eslinga textil central', 'Eslingas textiles de 4 puntos distribuidos', 'Montacargas sin eslingas'], correctAnswer: 2, explanation: 'Se usan eslingas textiles de 4 puntos para distribuir la carga. Un punto central genera flexión concentrada.' },
            { questionText: '¿Qué riesgo genera la despresurización brusca del RTP tras la prueba?', options: ['Aumento de temperatura', 'Colapso del liner por presión negativa (vacío)', 'Oxidación del refuerzo de aramida', 'Deformación de los fittings'], correctAnswer: 1, explanation: 'La despresurización brusca puede crear vacío interno que colapsa el liner de HDPE; siempre despresurizar lentamente.' },
          ],
        },
      },
      {
        order: 5, isPremium: false, passingScore: 70,
        title: 'Servicio Ácido (Sour Service) — API 15SA',
        description: 'Requisitos adicionales de API Spec 15SA para RTP en servicio con H₂S, CO₂ y salmueras corrosivas en sistemas de recolección (gathering) de petróleo y gas.',
        lessons: [
          { order: 1, title: 'Alcance de API 15SA y definición de servicio ácido',
            content: 'API Specification 15SA extiende API 15S para sistemas que operan en ambientes con:\n\n• H₂S con presión parcial ≥ 0.1 psia (0.0007 MPa) — umbral NACE MR0175 / ISO 15156 para definir sour service.\n• CO₂ libre en fase gaseosa o como ácido carbónico disuelto.\n• Salmueras de alta salinidad (TDS > 50,000 ppm).\n\nDiferencias principales respecto a API 15S:\n1. Requisitos adicionales de resistencia del liner a permeación de H₂S y CO₂.\n2. Ensayos de inmersión química en el fluido de servicio específico.\n3. Restricciones sobre materiales metálicos del fitting (susceptibilidad a SSC).\n4. Requisitos de monitoreo de permeación en servicio.' },
          { order: 2, title: 'Mecanismos de degradación del RTP en sour service',
            content: 'El polietileno (HDPE/XLPE) es inmune a la corrosión electroquímica y al SSC. Sin embargo, en sour service hay dos mecanismos críticos:\n\n1. Permeación molecular: el H₂S y CO₂ son moléculas pequeñas que difunden a través del liner de PE hasta el anular. Si el refuerzo es de acero, el H₂S acumulado puede causar SSC en el alambre. Por esto, en sour service se prefiere refuerzo de aramida o fibra de vidrio.\n\n2. Blistering (ampollas): cuando la presión cae rápidamente (blow-down), el H₂S o CO₂ disuelto en el PE puede desorberse más rápido de lo que difunde, formando ampollas internas en el liner. API 15SA especifica ensayo de blow-down a la máxima velocidad de descompresión prevista en operación.' },
          { order: 3, title: 'Ensayos de calificación adicionales API 15SA',
            content: 'Además de los ensayos de API 15S, API 15SA requiere:\n\n• Ensayo de inmersión química: muestras del liner sumergidas en fluido de servicio sintético a temperatura máxima de operación durante 1000 horas. Criterios: variación de masa ≤ ±3%, variación de resistencia a la tracción ≤ -10%, ausencia de cracking o swelling visual.\n\n• Ensayo de permeación: medición de la tasa de permeación de H₂S y CO₂ a través del liner a condiciones de operación.\n\n• Ensayo de blow-down: presurización con mezcla gas/líquido a concentración de servicio + despresurización a máxima velocidad esperada. Criterio: sin blistering, deformación permanente o pérdida de integridad.\n\n• Calificación de fittings en sour service: componentes metálicos deben cumplir NACE MR0175 / ISO 15156.' },
        ],
        quiz: {
          title: 'Evaluación M5 — Sour Service API 15SA',
          questions: [
            { questionText: '¿Cuál es la presión parcial mínima de H₂S que define "sour service" según NACE MR0175?', options: ['0.01 psia', '0.05 psia', '0.1 psia (0.0007 MPa)', '1.0 psia'], correctAnswer: 2, explanation: 'NACE MR0175 / ISO 15156 define sour service cuando la presión parcial de H₂S ≥ 0.1 psia (0.0007 MPa).' },
            { questionText: '¿Por qué se prefiere refuerzo de aramida sobre alambre de acero en sour service?', options: ['Mayor resistencia a la presión', 'La aramida no es susceptible a SSC por H₂S permeado al anular', 'Menor costo en sour service', 'Mayor resistencia a la temperatura'], correctAnswer: 1, explanation: 'La aramida es un polímero no metálico; no sufre Sulfide Stress Cracking (SSC) a diferencia del alambre de acero.' },
            { questionText: '¿Qué norma rige los materiales metálicos de fittings en sour service?', options: ['API 5CT', 'ASME B31.3', 'NACE MR0175 / ISO 15156', 'ASTM A105'], correctAnswer: 2, explanation: 'Los materiales metálicos en sour service deben cumplir NACE MR0175 / ISO 15156 para evitar SSC y HIC.' },
            { questionText: '¿Qué fenómeno evalúa el ensayo de blow-down de API 15SA?', options: ['Resistencia axial del fitting', 'Formación de ampollas (blistering) en el liner por descompresión rápida', 'Resistencia a la presión a alta temperatura', 'Permeación de agua salada al anular'], correctAnswer: 1, explanation: 'El blow-down evalúa si el liner forma ampollas cuando el gas disuelto se dessorbe más rápido que lo que puede difundir.' },
            { questionText: '¿Cuánto dura el ensayo de inmersión química de API 15SA?', options: ['100 horas', '500 horas', '1000 horas', '5000 horas'], correctAnswer: 2, explanation: 'El ensayo de inmersión química para calificación API 15SA tiene duración de 1000 horas.' },
            { questionText: '¿Cuál es la variación máxima de masa aceptable en el liner tras inmersión química?', options: ['±1%', '±3%', '±5%', '±10%'], correctAnswer: 1, explanation: 'El criterio de aceptación del ensayo de inmersión química es variación de masa ≤ ±3% del valor inicial.' },
            { questionText: '¿Cuál es la variación máxima de resistencia a tracción del liner tras inmersión?', options: ['-5%', '-10%', '-20%', '-30%'], correctAnswer: 1, explanation: 'La resistencia a la tracción no debe disminuir más del 10% respecto al valor original tras 1000 h de inmersión.' },
            { questionText: '¿Cómo difunde el H₂S a través del liner de HDPE en sour service?', options: ['Por porosidad del polietileno', 'Por difusión molecular — H₂S es una molécula pequeña', 'Por reacción química con el polietileno', 'Por presión que destruye el liner'], correctAnswer: 1, explanation: 'H₂S y CO₂ son moléculas pequeñas que difunden molecularmente a través de la matriz del polietileno.' },
            { questionText: '¿Qué concentración de TDS define alta salinidad en API 15SA?', options: ['> 5,000 ppm', '> 20,000 ppm', '> 50,000 ppm', '> 100,000 ppm'], correctAnswer: 2, explanation: 'API 15SA considera alta salinidad cuando la concentración de TDS supera los 50,000 ppm.' },
            { questionText: '¿Cuál es la diferencia principal entre API 15S y API 15SA?', options: ['15SA cubre mayor presión nominal', '15SA añade requisitos para H₂S, CO₂ y salmueras corrosivas', '15SA aplica solo a instalaciones offshore', '15SA tiene menor factor de diseño'], correctAnswer: 1, explanation: 'API 15SA extiende API 15S añadiendo requisitos específicos para H₂S, CO₂ libre y salmueras de alta salinidad.' },
          ],
        },
      },
      {
        order: 6, isPremium: false, passingScore: 70,
        title: 'Inyección de Alta Presión — API 15SIH',
        description: 'Requisitos de API Spec 15SIH para RTP en servicio de inyección de fluidos a alta presión: diseño para fatiga cíclica, prueba de fábrica y monitoreo del anular.',
        lessons: [
          { order: 1, title: 'Alcance de API 15SIH y aplicaciones de inyección',
            content: 'API Specification 15SIH (Spoolable Reinforced Thermoplastic Pipe for High Pressure Injection Service) cubre RTP para inyección de fluidos en yacimientos (EOR y waterflooding). Presiones típicas: 1000 a 5000 psi (69 a 345 bar), en algunos proyectos > 7000 psi (483 bar).\n\nAplicaciones cubiertas:\n• Líneas de inyección de agua de mar o producida (waterflooding headers)\n• Inyección de polímeros (polymer flooding)\n• Inyección de vapor de baja presión\n• Distribución de agua de inyección en campo maduro\n\nA diferencia de API 15S (líneas de producción), API 15SIH considera específicamente la fatiga por operación cíclica de los sistemas de inyección, donde las bombas generan oscilaciones de presión frecuentes.' },
          { order: 2, title: 'Factor de diseño y prueba hidrostática de fábrica',
            content: 'Diseño bajo API 15SIH:\n\n• Factor de diseño: 0.20 (MBP ≥ 5 × NWP), más conservador que API 15S (0.25), reconociendo la criticidad del servicio y posibilidad de sobrepresiones transitorias por arranque de bomba.\n\n• Análisis de fatiga: el fabricante debe demostrar mediante ensayo cíclico que el sistema soporta el número de ciclos esperado. Para inyección continua con bombas reciprocantes: 10⁷ a 10⁸ ciclos en 20 años de vida útil.\n\n• Prueba hidrostática de fábrica (FHT): cada tramo producido se prueba a 1.5 × NWP durante mínimo 5 minutos. Registro obligatorio: fecha, lote y resultado pass/fail.\n\n• Temperatura máxima: 60 °C para liner HDPE. Para T > 60 °C se requiere XLPE o PPA (poliamida) con calificación específica.' },
          { order: 3, title: 'Monitoreo del anular en sistemas de inyección',
            content: 'En inyección de alta presión, la acumulación de fluido en el anular es crítica:\n\nAnnular vent fittings: los fabricantes proveen accesorios de venteo del anular que permiten:\n1. Detectar permeación del fluido de inyección al anular (indicador de degradación del liner)\n2. Liberar presión acumulada para evitar colapso del liner por inversión de presión\n\nProtocolo de venteo:\n• Verificación mensual de presión en el anular\n• Registro del volumen y composición del fluido venteado\n• Criterio de reemplazo: si la tasa de permeación supera el límite del fabricante\n\nCriterio de decommissioning: si el monitoreo detecta permeación superior al límite, o H₂S en el anular con refuerzo de acero, iniciar procedimiento de retiro de servicio y reemplazo del tramo.' },
        ],
        quiz: {
          title: 'Evaluación M6 — Inyección Alta Presión API 15SIH',
          questions: [
            { questionText: '¿Cuál es el factor de diseño (MBP/NWP) de API 15SIH?', options: ['0.25 (MBP ≥ 4×NWP)', '0.20 (MBP ≥ 5×NWP)', '0.15 (MBP ≥ 6.7×NWP)', '0.33 (MBP ≥ 3×NWP)'], correctAnswer: 1, explanation: 'API 15SIH usa factor de diseño 0.20 (MBP ≥ 5 × NWP), más conservador que API 15S (0.25).' },
            { questionText: '¿Por qué API 15SIH es más conservador que API 15S en factor de diseño?', options: ['Por el alto peso específico del agua', 'Por las oscilaciones de presión frecuentes de bombas y posibilidad de sobrepresión transitoria', 'Por la alta viscosidad de los polímeros', 'Por los cambios térmicos del yacimiento'], correctAnswer: 1, explanation: 'Las bombas de inyección generan oscilaciones de presión frecuentes y sobrepresiones transitorias por arranque, lo que exige mayor factor de seguridad.' },
            { questionText: '¿Cuál es la prueba hidrostática de fábrica (FHT) requerida por API 15SIH?', options: ['1.0 × NWP — 5 min', '1.25 × NWP — 5 min', '1.5 × NWP — 5 min mínimo', '2.0 × NWP — 30 min'], correctAnswer: 2, explanation: 'API 15SIH requiere FHT = 1.5 × NWP durante mínimo 5 minutos para cada tramo producido.' },
            { questionText: '¿Cuántos ciclos puede acumular un sistema de inyección con bombas reciprocantes en 20 años?', options: ['10⁴ a 10⁵', '10⁵ a 10⁶', '10⁷ a 10⁸', '10⁹ a 10¹⁰'], correctAnswer: 2, explanation: 'Los sistemas de inyección con bombas reciprocantes generan entre 10⁷ y 10⁸ ciclos de presión en 20 años.' },
            { questionText: '¿Cuál es la temperatura máxima para liner HDPE en API 15SIH?', options: ['40 °C', '60 °C', '80 °C', '100 °C'], correctAnswer: 1, explanation: 'La temperatura máxima para liner HDPE estándar en API 15SIH es 60 °C; para mayor temperatura se requiere XLPE o PPA.' },
            { questionText: '¿Para qué sirve el annular vent fitting en sistemas de inyección RTP?', options: ['Para aumentar presión de operación', 'Para detectar permeación al anular y liberar presión acumulada', 'Para purgar el fluido antes del mantenimiento', 'Para medir temperatura del liner'], correctAnswer: 1, explanation: 'El annular vent fitting detecta permeación y ventea la presión del anular, previniendo colapso del liner por inversión de presión.' },
            { questionText: '¿Cuál es la frecuencia típica de verificación del anular en sistemas de inyección?', options: ['Diaria', 'Semanal', 'Mensual', 'Anual'], correctAnswer: 2, explanation: 'El protocolo típico de monitoreo del anular en sistemas de inyección establece verificación mensual.' },
            { questionText: '¿Cuándo se activa el criterio de decommissioning del tramo RTP?', options: ['Al cumplir 5 años de operación', 'Cuando la tasa de permeación supera el límite del fabricante o hay H₂S en el anular con refuerzo de acero', 'Cuando la presión supera el 80% de NWP', 'Solo cuando hay fuga visible al exterior'], correctAnswer: 1, explanation: 'El decommissioning se activa si la tasa de permeación supera el límite del fabricante o si se detecta H₂S en el anular con refuerzo de acero susceptible a SSC.' },
            { questionText: '¿Qué información mínima debe registrarse en el FHT de fábrica?', options: ['Solo la presión', 'Fecha, número de lote y resultado pass/fail', 'Solo el nombre del inspector', 'Solo la temperatura del agua'], correctAnswer: 1, explanation: 'El registro mínimo del FHT debe incluir fecha, número de lote del tubo y resultado (pasa/falla).' },
            { questionText: '¿Qué EOR aplica API 15SIH?', options: ['Solo inyección de CO₂ supercrítico', 'Solo inyección de gas seco', 'Inyección de agua, polímeros y vapor de baja presión', 'Solo inyección de nitrógeno'], correctAnswer: 2, explanation: 'API 15SIH cubre inyección de agua de producción/mar, polímeros (polymer flooding) y vapor de baja presión.' },
          ],
        },
      },
      {
        order: 7, isPremium: false, passingScore: 70,
        title: 'Gestión de Integridad de Sistemas RTP en Operación',
        description: 'Amenazas a la integridad, programa de inspección, monitoreo en servicio y criterios de reparación o retiro de servicio para sistemas RTP operando en campo.',
        lessons: [
          { order: 1, title: 'Amenazas a la integridad del RTP en operación',
            content: 'Amenazas mecánicas:\n• Daño por interferencia de terceros (excavación accidental): principal causa de falla estadística en sistemas enterrados. Mitigación: señalización de derecho de vía, profundidad adecuada, sistemas de detección.\n• Sobre-flexión: doblar por debajo del MBR en mantenimiento o por asentamiento del suelo.\n• Aplastamiento: carga puntual por paso de maquinaria pesada sobre zona no protegida.\n\nAmenazas por permeación y degradación:\n• Permeación de H₂S/CO₂ al anular con refuerzo metálico → SSC del alambre de acero.\n• Blistering del liner por blow-down no controlados.\n• Degradación UV del jacket en exposición prolongada sin cubierta.\n\nAmenazas operacionales:\n• Sobrepresión transitoria: golpes de ariete por cierre rápido de válvulas.\n• Sobretemperatura sostenida por encima de la temperatura máxima calificada.\n• Ciclos de presión en exceso de la envolvente de fatiga calificada.' },
          { order: 2, title: 'Programa de inspección y monitoreo en servicio',
            content: 'Componentes del programa de gestión de integridad:\n\n• Inspección visual del derecho de vía (ROW): verificación de exposiciones, afloramientos, evidencias de excavación de terceros y cruces. Frecuencia mínima recomendada: semestral para líneas de alta presión.\n\n• Monitoreo de presión y temperatura: registro continuo o periódico. Caídas de presión sin causa operacional son indicador de posible fuga.\n\n• Monitoreo del anular (para sistemas con annular vent): verificación mensual de presión, registro del volumen y composición del fluido venteado.\n\n• KPIs de integridad:\n  - Número de fugas por 100 km-año\n  - Tiempo medio entre fallas (MTBF)\n  - % de inspecciones de ROW completadas en plazo\n  - Número de excursiones operacionales registradas\n  - Tiempo medio de respuesta a emergencias' },
          { order: 3, title: 'Criterios de reparación y retiro de servicio',
            content: 'Lógica de decisión ante daño detectado:\n\nDaño en jacket exterior (sin afectar refuerzo): reparable con kit del fabricante (manga termorretráctil o pintura especializada) sin despresurizar, si se confirma que el refuerzo está intacto.\n\nDaño en capa de refuerzo: requiere evaluación Fitness for Service (FFS). Los métodos FFS genéricos (API 579) no aplican directamente al RTP (material compuesto anisótropo). Consultar al fabricante. Si FFS no puede confirmarse → retirar de servicio.\n\nFuga activa: despresurización inmediata + aislamiento con válvulas de bloqueo + reparación con clamp de emergencia o reemplazo del tramo + prueba hidrostática a 1.25 × NWP durante 4 horas antes de retornar a servicio.\n\nCriteria de retiro automático:\n• Presión de operación > 110% de NWP por más de 1 hora acumulada\n• Temperatura > temperatura máxima calificada + 5 °C\n• Tasa de permeación al anular superior al límite del fabricante' },
        ],
        quiz: {
          title: 'Evaluación M7 — Gestión de Integridad RTP',
          questions: [
            { questionText: '¿Cuál es la principal causa estadística de falla en sistemas RTP enterrados?', options: ['Corrosión interna del liner', 'Daño por interferencia de terceros (excavación)', 'Degradación UV del jacket', 'Colapso por vacío'], correctAnswer: 1, explanation: 'La interferencia de terceros es estadísticamente la principal causa de falla en sistemas de tubería enterrada incluyendo RTP.' },
            { questionText: '¿Cuál es la frecuencia mínima recomendada de inspección del ROW en líneas de alta presión?', options: ['Mensual', 'Trimestral', 'Semestral', 'Anual'], correctAnswer: 2, explanation: 'La práctica de la industria recomienda inspección visual del ROW con frecuencia mínima semestral para líneas de alta presión.' },
            { questionText: '¿Qué KPI es el más utilizado para medir el desempeño de integridad de un sistema de tuberías?', options: ['Presión de operación promedio', 'Número de fugas por 100 km-año', '% de utilización de capacidad', 'Número de conexiones por km'], correctAnswer: 1, explanation: 'El número de fugas por 100 km-año es el KPI de integridad más utilizado para comparar sistemas de tuberías.' },
            { questionText: '¿Qué acción inmediata se requiere ante fuga activa en un sistema RTP?', options: ['Reducir presión al 50% y continuar', 'Despresurizar inmediatamente y aislar con válvulas de bloqueo', 'Aumentar inhibidor de corrosión', 'Esperar la próxima parada programada'], correctAnswer: 1, explanation: 'Ante fuga activa: despresurización inmediata y aislamiento del tramo con válvulas de bloqueo.' },
            { questionText: '¿Cuándo puede repararse un daño en el jacket exterior SIN despresurizar?', options: ['Siempre', 'Solo si el daño no afecta la capa de refuerzo', 'Solo si presión < 50% NWP', 'Nunca sin despresurizar'], correctAnswer: 1, explanation: 'Si el daño se confirma limitado al jacket sin afectar el refuerzo, puede repararse con kit del fabricante sin despresurizar.' },
            { questionText: '¿Por qué no aplican directamente los métodos FFS genéricos (API 579) al RTP dañado?', options: ['Porque API 579 no cubre sistemas subterráneos', 'Porque el RTP es un material compuesto anisótropo, no un metal homogéneo', 'Porque API 579 no es reconocido en la industria', 'Porque el RTP no tiene defectos superficiales'], correctAnswer: 1, explanation: 'API 579 está desarrollado para metales homogéneos isótropos. El RTP es un material compuesto anisótropo con comportamiento diferente.' },
            { questionText: '¿Cuánto puede superar la temperatura máxima calificada antes de activar el retiro de servicio?', options: ['> 2 °C', '> 5 °C', '> 10 °C', '> 20 °C'], correctAnswer: 1, explanation: 'Si la temperatura excede la máxima calificada en más de 5 °C, se debe iniciar el retiro de servicio.' },
            { questionText: '¿Qué prueba debe realizarse sobre el tramo reparado antes de retornar a operación?', options: ['Solo inspección visual', 'Solo prueba neumática', 'Prueba hidrostática 1.25 × NWP durante 4 horas', 'Solo medición dimensional'], correctAnswer: 2, explanation: 'Tras reparación, el tramo se somete a prueba hidrostática a 1.25 × NWP durante 4 horas antes de retornar a servicio.' },
            { questionText: '¿Cuánto tiempo acumulado de operación > 110% NWP activa el criterio de retiro?', options: ['15 minutos', '30 minutos', '1 hora acumulada', '4 horas acumuladas'], correctAnswer: 2, explanation: 'Operación por encima del 110% de NWP por más de 1 hora acumulada activa el criterio de retiro automático.' },
            { questionText: '¿Qué amenaza puede generar SSC en el alambre de refuerzo de acero?', options: ['Sobrepresión operacional', 'Permeación de H₂S al anular en servicio sour', 'Exposición UV en superficie', 'Ciclos de temperatura'], correctAnswer: 1, explanation: 'El H₂S que permea el liner y se acumula en el anular puede causar Sulfide Stress Cracking (SSC) en el refuerzo de acero.' },
          ],
        },
      },
      {
        order: 8, isPremium: false, passingScore: 70,
        title: 'RTP en Ambiente Marino — API 15S en Instalaciones Costeras y Offshore',
        description: 'Consideraciones de diseño, protección mecánica y monitoreo para sistemas RTP instalados en ambiente marino costero y offshore superficial.',
        lessons: [
          { order: 1, title: 'Condiciones de servicio marino y selección de materiales',
            content: 'El ambiente marino introduce cargas y mecanismos de degradación adicionales:\n\nCorrosión marina del jacket: el agua de mar contiene ≈35 g/L de sales. El jacket de HDPE/MDPE con ≥2% Carbon Black tiene excelente resistencia; no requiere protección catódica ni recubrimientos adicionales.\n\nCargas hidrodinámicas y VIV: cuando la velocidad de corriente marina supera el umbral crítico (función del diámetro y frecuencia natural del tramo), se puede inducir Vortex Induced Vibration (VIV). El RTP debe anclarse con abrazaderas anti-VIV a intervalos calculados por el fabricante.\n\nFlotabilidad: el HDPE tiene densidad ≈0.95 g/cm³, menor al agua de mar (≈1.025 g/cm³), lo que genera flotabilidad positiva que debe controlarse en instalaciones sumergidas.\n\nTemperatura del agua de mar: -2 °C (ártico) a 32 °C (Golfo de México). La selección del liner se basa en la temperatura del fluido transportado, no en la temperatura del agua de mar.' },
          { order: 2, title: 'Protección mecánica: splash zone y beach crossing',
            content: 'Zonas de mayor riesgo mecánico en instalaciones costeras:\n\nSplash zone (zona de oleaje): el movimiento cíclico del oleaje genera fatiga mecánica. Protección requerida:\n• Revestimiento de caucho natural o neopreno ≥ 6 mm de espesor.\n• Abrazaderas de HDPE o GRP fijadas a estructura o pilote.\n• Inspección visual mensual durante los primeros 2 años de operación.\n\nBeach crossing (cruce de costa / surf zone): zona de surf aplica cargas de impacto y abrasión por arena. Práctica estándar:\n• Instalar el RTP dentro de un tubo guía de HDPE (casing) que permita extracción para inspección.\n• El casing debe enterrarse por debajo de la profundidad de acción de las olas (normalmente 3-5 m bajo el lecho marino en la línea de costa).\n• Rellenar el anular del casing con lechada de arena cementada para evitar arrastre.' },
          { order: 3, title: 'Control de flotabilidad y sistemas de anclaje submarino',
            content: 'Control de flotabilidad positiva del RTP en agua de mar:\n\nPesos de concreto (CWC — Concrete Weight Coating): segmentos del RTP se encapsulan en mortero de concreto. El CWC debe diseñarse para densidad del conjunto ≥ 1.10 × densidad del agua de mar (factor de estabilidad on-bottom mínimo recomendado).\n\nAnclajes a fondo (seabed anchors): para tramos en talud o corriente fuerte, anclas clavadas o de succión con correas de PP o cadenas de acero galvanizado. La separación entre anclas se calcula para mantener la configuración del tubo dentro de los límites de curvatura admisibles.\n\nSistemas lazy-wave: en instalaciones dinámicas (conectadas a embarcaciones flotantes), el RTP puede configurarse en lazy-wave para absorber movimientos del buque o plataforma. La longitud de la sección en catenaria debe evitar exceder el MBR dinámico bajo ninguna condición de carga.' },
        ],
        quiz: {
          title: 'Evaluación M8 — RTP en Ambiente Marino',
          questions: [
            { questionText: '¿Por qué el RTP de HDPE no requiere protección catódica en ambiente marino?', options: ['Porque siempre está enterrado', 'Porque el jacket de HDPE es polímero no metálico, inmune a corrosión electroquímica', 'Porque el agua de mar no es corrosiva para el polietileno', 'Porque la corriente marina evita la corrosión'], correctAnswer: 1, explanation: 'El HDPE es un polímero dieléctrico no metálico. La corrosión electroquímica solo afecta metales; el jacket de HDPE no la sufre.' },
            { questionText: '¿Qué fenómeno genera vibración en el RTP cuando la corriente marina supera el umbral crítico?', options: ['Golpe de ariete (water hammer)', 'Vibración por Vórtices (VIV — Vortex Induced Vibration)', 'Cavitación interna', 'Resonancia acústica'], correctAnswer: 1, explanation: 'Las corrientes por encima del umbral crítico inducen desprendimiento de vórtices alternados que generan VIV.' },
            { questionText: '¿Por qué el RTP tiene flotabilidad positiva en agua de mar?', options: ['Porque contiene gas atrapado', 'Porque la densidad del HDPE (≈0.95 g/cm³) es menor que la del agua de mar (≈1.025 g/cm³)', 'Porque el refuerzo de aramida flota', 'Porque el Carbon Black reduce la densidad'], correctAnswer: 1, explanation: 'El HDPE tiene densidad ≈0.95 g/cm³, menor al agua de mar (≈1.025 g/cm³), generando flotabilidad positiva neta.' },
            { questionText: '¿Cuál es el factor de estabilidad on-bottom mínimo recomendado para RTP con peso de concreto?', options: ['1.0 × densidad agua de mar', '1.10 × densidad agua de mar', '1.25 × densidad agua de mar', '1.5 × densidad agua de mar'], correctAnswer: 1, explanation: 'La densidad del conjunto CWC + RTP debe ser ≥ 1.10 × densidad del agua de mar para estabilidad on-bottom.' },
            { questionText: '¿Qué espesor mínimo de revestimiento de caucho se recomienda en splash zone?', options: ['2 mm', '4 mm', '6 mm', '10 mm'], correctAnswer: 2, explanation: 'Se recomienda revestimiento de caucho o neopreno de al menos 6 mm de espesor en la splash zone.' },
            { questionText: '¿Qué profundidad mínima requiere el casing en un beach crossing?', options: ['Sobre el lecho marino', '1 m bajo el lecho marino', '3-5 m bajo la profundidad de acción del oleaje', 'Solo en la línea de costa'], correctAnswer: 2, explanation: 'El casing debe enterrarse 3-5 m por debajo de la profundidad de acción de las olas para evitar exposición por erosión.' },
            { questionText: '¿Cuál es la concentración de sales del agua de mar estándar?', options: ['5 g/L', '15 g/L', '35 g/L', '70 g/L'], correctAnswer: 2, explanation: 'El agua de mar estándar contiene aproximadamente 35 g/L de sales disueltas (salinidad de 35 ppt).' },
            { questionText: '¿Qué configuración geométrica absorbe movimientos dinámicos de plataformas flotantes?', options: ['Línea recta tensa (taut)', 'Vertical (vertical riser)', 'Lazy-wave o S-lay', 'Espiral helicoidal'], correctAnswer: 2, explanation: 'La configuración lazy-wave crea una reserva de longitud en catenaria que absorbe los movimientos de la plataforma sin exceder el MBR.' },
            { questionText: '¿Con qué frecuencia se recomienda inspección visual en splash zone los primeros 2 años?', options: ['Anual', 'Semestral', 'Trimestral', 'Mensual'], correctAnswer: 3, explanation: 'Durante los primeros 2 años, la inspección visual mensual en splash zone verifica la integridad del revestimiento anti-fatiga.' },
            { questionText: '¿Qué parámetro crítico debe verificarse en el diseño lazy-wave del RTP?', options: ['Que el diámetro interior sea constante', 'Que la temperatura del agua de mar < 32 °C', 'Que la configuración dinámica nunca exceda el MBR', 'Que el color del jacket sea visible'], correctAnswer: 2, explanation: 'En el diseño lazy-wave, el parámetro crítico es que bajo cualquier condición dinámica el radio de curvatura no sea inferior al MBR.' },
          ],
        },
      },
      {
        order: 9, isPremium: true, passingScore: 85,
        title: 'API 17J — Líneas Flexibles Submarinas de Aguas Profundas',
        description: 'MÓDULO PREMIUM — Diseño, calificación y gestión de integridad de tuberías flexibles no pegadas (unbonded) para aplicaciones subsea y deep water según API Spec 17J / ISO 13628-2.',
        lessons: [
          { order: 1, title: 'Alcance de API 17J y arquitectura del flexible submarino',
            content: 'API Specification 17J (Specification for Unbonded Flexible Pipe), idéntica a ISO 13628-2, cubre tuberías flexibles no pegadas (unbonded) para flowlines, risers y jumpers en ambiente submarino hasta 3000 m (10,000 ft) de profundidad.\n\nArquitectura típica de capas (5-8 capas):\n1. Carcass (carcasa): acero inoxidable (tipo 304/316L o duplex). Capa más interior, función anti-colapso ante presión hidrostática externa y succión interna.\n2. Pressure sheath (barrera de presión): polímero — HDPE (hasta 60 °C), PA11 (hasta 90 °C), PA12 (hasta 80 °C), PVDF (hasta 130 °C). Garantiza hermeticidad.\n3. Armadura de presión (zeta wire o carcass wire): alambre de acero en ángulo alto (≈85°). Resiste la presión interna.\n4. Armaduras de tracción (tensile armor): 1-2 capas de alambre de acero en ángulo bajo (≈35-55°). Resisten carga axial y peso propio.\n5. External sheath (cubierta exterior): polimero, protección contra daño mecánico y agua de mar.\n\nCertificación obligatoria: TPICP (Third Party Independent Certification and Qualification Program) por DNV, Bureau Veritas, Lloyd\'s Register o ABS.' },
          { order: 2, title: 'Análisis de fatiga en risers flexibles API 17J',
            content: 'Los flexibles API 17J están sujetos a cargas dinámicas continuas durante toda su vida útil. El análisis de fatiga es obligatorio:\n\nFatiga por VIV de riser: las corrientes marinas a diferentes profundidades inducen VIV en distintos modos. El análisis calcula el daño de fatiga acumulado según la regla de Palmgren-Miner. Criterio: D < 0.1 (factor de seguridad mínimo de 10 sobre la vida útil del proyecto).\n\nFatiga por movimientos de plataforma (WIO): las olas inducen movimientos de 6 grados de libertad en FPSOs y semi-sumergibles. El riser experimenta ciclos de flexión en la zona de touchdown (TDZ) y en el conector superior (top connector). La curva S-N de fatiga de cada componente debe obtenerse de ensayo del fabricante.\n\nAnálisis de Touchdown Zone (TDZ): el punto donde el riser toca el lecho marino concentra ciclos de flexión. Debe demostrarse que el flexible no supera el MBR dinámico bajo la combinación de condiciones extremas: ola de 100 años + corriente de 10 años (100-year wave + 10-year current).' },
          { order: 3, title: 'Gestión del anular y monitoreo de integridad offshore',
            content: 'En los flexibles API 17J, el anular (entre barrera de presión y armaduras) requiere gestión activa:\n\nGestión del anular (Annulus Management): el H₂S, CO₂ y agua que permean la barrera se acumulan en el anular. Todos los flexibles tienen end fittings con annulus vent ports. El protocolo de venteo debe:\n1. Realizar venteos periódicos (cada 3-6 meses) para liberar presión parcial de gases permeados.\n2. Analizar composición del gas venteado (H₂S, CO₂, CH₄).\n3. Comparar volumen venteado con modelo de permeación del fabricante. Exceder el 150% del volumen esperado es indicador de alerta.\n\nMonitoreo continuo:\n• DTS (Distributed Temperature Sensing): sensores de temperatura a lo largo del riser para detectar fugas por anomalía térmica y monitorear temperatura del barrier en tiempo real.\n• Sensores de presión en el anular para detección temprana de sobrepresión.\n• Inspección por ROV de end fittings y cuerpo del riser con frecuencia mínima anual.' },
        ],
        quiz: {
          title: 'Evaluación Premium M9 — API 17J Flexibles Submarinos',
          questions: [
            { questionText: '¿Con qué norma ISO es técnicamente idéntica API Spec 17J?', options: ['ISO 13628-1', 'ISO 13628-2', 'ISO 13628-4', 'ISO 15156'], correctAnswer: 1, explanation: 'API Spec 17J es técnicamente idéntica a ISO 13628-2, ambas cubren tuberías flexibles no pegadas para aplicaciones submarinas.' },
            { questionText: '¿Cuál es la función de la carcass de acero inoxidable en un flexible API 17J?', options: ['Resistir la presión interna del fluido', 'Anti-colapso ante presión hidrostática externa y succión interna', 'Conectar las armaduras de tracción', 'Proteger contra UV en superficie'], correctAnswer: 1, explanation: 'La carcass es la capa más interior y actúa como elemento anti-colapso contra la presión hidrostática externa del agua y la succión interna.' },
            { questionText: '¿Cuál es la profundidad máxima de agua que cubre API 17J?', options: ['500 m', '1500 m', '2000 m', '3000 m (10,000 ft)'], correctAnswer: 3, explanation: 'API Specification 17J cubre instalaciones de flexibles hasta 3000 m (10,000 ft) de profundidad de agua.' },
            { questionText: '¿Qué factor de seguridad mínimo de fatiga requiere API 17J (regla Palmgren-Miner)?', options: ['Factor 2 (D < 0.5)', 'Factor 5 (D < 0.2)', 'Factor 10 (D < 0.1)', 'Factor 20 (D < 0.05)'], correctAnswer: 2, explanation: 'API 17J requiere factor de seguridad de fatiga de 10, equivalente a daño acumulado D < 0.1 en la vida útil del proyecto.' },
            { questionText: '¿Qué organismo puede emitir la certificación TPICP requerida por API 17J?', options: ['Solo API', 'DNV, Bureau Veritas, Lloyd\'s Register o ABS', 'Solo el fabricante del flexible', 'Solo la empresa operadora'], correctAnswer: 1, explanation: 'API 17J requiere certificación TPICP por organismos reconocidos: DNV, Bureau Veritas, Lloyd\'s Register o ABS.' },
            { questionText: '¿Cuál es el rango de temperatura de operación de la barrera de PVDF según API 17J?', options: ['Hasta 60 °C', 'Hasta 80 °C', 'Hasta 90 °C', 'Hasta 130 °C'], correctAnswer: 3, explanation: 'La barrera de PVDF (Polyvinylidene Fluoride) permite operación hasta 130 °C, siendo el polímero de mayor temperatura en API 17J.' },
            { questionText: '¿Qué zona del riser concentra los ciclos de flexión por contacto con el lecho marino?', options: ['Top connector (conector superior)', 'Touchdown Zone (TDZ)', 'Mid-water arch', 'Hang-off point'], correctAnswer: 1, explanation: 'La Touchdown Zone (TDZ) es donde el riser contacta el lecho marino y concentra los ciclos de flexión críticos para fatiga.' },
            { questionText: '¿Qué condición extrema de diseño aplica al análisis de fatiga de la TDZ?', options: ['10-year wave + 10-year current', '100-year wave + 10-year current asociada', '1000-year wave + 100-year current', '50-year wave sin corriente'], correctAnswer: 1, explanation: 'El análisis extremo de TDZ usa la combinación de ola de 100 años con corriente asociada de 10 años.' },
            { questionText: '¿Cuál es el indicador de alerta en el monitoreo del anular de un flexible API 17J?', options: ['Venteo anual > 10 litros', 'Volumen venteado > 150% del modelo de permeación del fabricante', 'Detección de CO₂ en el gas venteado', 'Temperatura del anular > 60 °C'], correctAnswer: 1, explanation: 'Exceder el 150% del volumen de permeación esperado según el modelo del fabricante es el indicador estándar de alerta.' },
            { questionText: '¿Para qué sirve el DTS (Distributed Temperature Sensing) en risers API 17J?', options: ['Medir temperatura del agua de mar en profundidad', 'Detectar fugas por anomalía térmica y monitorear temperatura del barrier en tiempo real', 'Controlar temperatura de inyección de inhibidores', 'Medir la elongación del riser'], correctAnswer: 1, explanation: 'El DTS mide distribución de temperatura a lo largo del riser; una anomalía térmica localizada puede indicar una fuga o permeación anómala.' },
          ],
        },
      },
    ];

    for (const modData of modules) {
      const { lessons, quiz, ...moduleFields } = modData;
      const savedModule = await this.modulesRepo.save(
        this.modulesRepo.create({
          order: moduleFields.order,
          title: moduleFields.title,
          description: moduleFields.description,
          isPremium: moduleFields.isPremium,
          passingScore: moduleFields.passingScore,
        }),
      );
      this.logger.log(`  ✅ Módulo ${savedModule.order}: ${savedModule.title}`);

      for (const lessonData of lessons) {
        await this.lessonsRepo.save(
          this.lessonsRepo.create({ ...lessonData, moduleId: savedModule.id }),
        );
      }

      const savedQuiz = await this.quizzesRepo.save(
        this.quizzesRepo.create({ title: quiz.title, moduleId: savedModule.id }),
      );
      for (const q of quiz.questions) {
        await this.questionsRepo.save(
          this.questionsRepo.create({ ...q, quizId: savedQuiz.id }),
        );
      }
      this.logger.log(`    📝 Quiz: "${quiz.title}" (${quiz.questions.length} preguntas)`);
    }

    this.logger.log('✅ Seed técnico completado — 9 módulos únicos API 15S/15SA/15SIH/17J');
    return { message: 'Seed ejecutado', modules: modules.length };
  }
}
