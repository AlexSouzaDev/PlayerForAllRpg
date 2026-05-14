import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { calcModificador, formatModificador, calcBonusProficiencia } from "@/lib/utils";
import type { FichaCompleta, InventarioItem, Magia, HabilidadesData } from "@/types/ficha";

Font.register({
  family: "Cinzel",
  src: "https://fonts.gstatic.com/s/cinzel/v23/8vIJ7ww63mVu7gtR-kwKxNvkNOjw-tbnTYrvDE5ZdqU.woff2",
});

const S = StyleSheet.create({
  page: { padding: 24, backgroundColor: "#0d0d0f", color: "#f0ece0", fontFamily: "Helvetica" },
  title: { fontFamily: "Cinzel", fontSize: 22, color: "#c9a84c", marginBottom: 4 },
  subtitle: { fontSize: 10, color: "#888070", marginBottom: 16 },
  section: { marginBottom: 14, borderBottom: "1 solid #2a2a2e", paddingBottom: 10 },
  sectionTitle: { fontFamily: "Cinzel", fontSize: 11, color: "#c9a84c", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 },
  row: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  stat: { alignItems: "center", borderWidth: 1, borderColor: "#2a2a2e", borderRadius: 4, padding: 6, minWidth: 60 },
  statLabel: { fontSize: 7, color: "#888070", textTransform: "uppercase" },
  statValue: { fontFamily: "Cinzel", fontSize: 18, color: "#f0ece0", marginTop: 2 },
  statMod: { fontSize: 10, color: "#c9a84c" },
  text: { fontSize: 9, color: "#f0ece0", lineHeight: 1.5 },
  label: { fontSize: 7, color: "#888070", textTransform: "uppercase", marginBottom: 2 },
  field: { marginBottom: 6 },
  skillRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2, borderBottom: "1 solid #2a2a2e14" },
  combatRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  combatStat: { borderWidth: 1, borderColor: "#2a2a2e", borderRadius: 4, padding: 6, minWidth: 70, alignItems: "center" },
});

const atributos = [
  { key: "forca" as const, abbr: "FOR" },
  { key: "destreza" as const, abbr: "DES" },
  { key: "constituicao" as const, abbr: "CON" },
  { key: "inteligencia" as const, abbr: "INT" },
  { key: "sabedoria" as const, abbr: "SAB" },
  { key: "carisma" as const, abbr: "CAR" },
];

interface Props {
  ficha: FichaCompleta;
}

export function FichaPDFTemplate({ ficha }: Props) {
  const prof = ficha.bonusDeProficiencia ?? calcBonusProficiencia(ficha.nivel ?? 1);
  const habilidades = ficha.habilidades as HabilidadesData | null;
  const inventario = (ficha.inventario ?? []) as InventarioItem[];
  const magias = ficha.magias as { lista?: Magia[] } | null;

  return (
    <Document title={`${ficha.nomePersonagem} — PlayerForAllRPG`}>
      <Page size="A4" style={S.page}>
        {/* Header */}
        <Text style={S.title}>{ficha.nomePersonagem}</Text>
        <Text style={S.subtitle}>
          {[ficha.raca, ficha.classe, ficha.subclasse, ficha.nivel ? `Nível ${ficha.nivel}` : null, ficha.sistema === "dnd5e" ? "D&D 5e" : ficha.sistema].filter(Boolean).join("  ·  ")}
        </Text>

        {/* Atributos */}
        {ficha.sistema === "dnd5e" && (
          <View style={S.section}>
            <Text style={S.sectionTitle}>Atributos</Text>
            <View style={S.row}>
              {atributos.map(({ key, abbr }) => {
                const val = ficha[key] ?? 10;
                const mod = calcModificador(val);
                return (
                  <View key={key} style={S.stat}>
                    <Text style={S.statLabel}>{abbr}</Text>
                    <Text style={S.statValue}>{val}</Text>
                    <Text style={S.statMod}>{formatModificador(mod)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Combate */}
        {ficha.sistema === "dnd5e" && (
          <View style={S.section}>
            <Text style={S.sectionTitle}>Combate</Text>
            <View style={S.combatRow}>
              {[
                { label: "HP", value: `${ficha.pontosDeVidaAtual ?? 0}/${ficha.pontosDeVidaMax ?? 0}` },
                { label: "CA", value: String(ficha.classeDeArmadura ?? 0) },
                { label: "Iniciativa", value: ficha.iniciativa != null ? formatModificador(ficha.iniciativa) : "—" },
                { label: "Deslocamento", value: `${ficha.deslocamento ?? 0}m` },
                { label: "Prof.", value: `+${prof}` },
                { label: "Dado de Vida", value: ficha.dadoDeVida ?? "d8" },
              ].map(({ label, value }) => (
                <View key={label} style={S.combatStat}>
                  <Text style={S.statLabel}>{label}</Text>
                  <Text style={{ ...S.statValue, fontSize: 12 }}>{value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Habilidades */}
        {habilidades?.habilidades && (
          <View style={S.section}>
            <Text style={S.sectionTitle}>Perícias</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
              {habilidades.habilidades.map(h => {
                const attrVal = ficha[h.atributo as keyof typeof ficha] as number ?? 10;
                const mod = calcModificador(attrVal);
                const total = h.expertise ? mod + prof * 2 : h.proficiente ? mod + prof : mod;
                return (
                  <View key={h.nome} style={{ ...S.skillRow, width: "48%" }}>
                    <Text style={{ ...S.text, color: h.proficiente ? "#c9a84c" : "#888070" }}>{h.nome}</Text>
                    <Text style={{ ...S.text, color: "#c9a84c" }}>{formatModificador(total)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Inventário */}
        {inventario.length > 0 && (
          <View style={S.section}>
            <Text style={S.sectionTitle}>Inventário</Text>
            {inventario.slice(0, 15).map(item => (
              <View key={item.id} style={S.skillRow}>
                <Text style={S.text}>{item.nome}</Text>
                <Text style={{ ...S.text, color: "#888070" }}>x{item.quantidade}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Magias */}
        {magias?.lista && magias.lista.length > 0 && (
          <View style={S.section}>
            <Text style={S.sectionTitle}>Magias</Text>
            {magias.lista.slice(0, 20).map(m => (
              <View key={m.id} style={S.skillRow}>
                <Text style={S.text}>{m.nome}</Text>
                <Text style={{ ...S.text, color: "#888070" }}>{m.nivel === 0 ? "Truque" : `${m.nivel}°`}</Text>
              </View>
            ))}
          </View>
        )}

        {/* História */}
        {ficha.historia && (
          <View style={S.section}>
            <Text style={S.sectionTitle}>História</Text>
            <Text style={S.text}>{ficha.historia.slice(0, 1000)}</Text>
          </View>
        )}

        {/* Campos customizados */}
        {ficha.camposPersonalizados && Array.isArray(ficha.camposPersonalizados) && ficha.camposPersonalizados.length > 0 && (
          <View style={S.section}>
            <Text style={S.sectionTitle}>Campos Personalizados</Text>
            {(ficha.camposPersonalizados as { id: string; chave: string; valor: string }[]).map(c => (
              <View key={c.id} style={S.skillRow}>
                <Text style={{ ...S.text, color: "#c9a84c" }}>{c.chave}:</Text>
                <Text style={S.text}>{c.valor}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={{ ...S.text, color: "#2a2a2e", marginTop: 8 }}>Gerado por PlayerForAllRPG</Text>
      </Page>
    </Document>
  );
}
