import React, { memo } from "react";
import PropTypes from "prop-types";


const styles = {
    card: {
        // --- Estilos para resetear el botón nativo ---
        border: "none",
        background: "none",
        padding: 0,
        fontFamily: "inherit",
        textAlign: "inherit",
        // ---------------------------------------------
        width: 220,
        borderRadius: 12,
        boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
        backgroundColor: "#fff", // Importante: color de fondo de la carta // Relleno interno
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
    },
    // ... (El resto de estilos imgWrap, img, header, etc. se quedan IGUAL) ...
    imgWrap: {
        width: 160,
        height: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
        backgroundColor: "#f5f5f5",
        borderRadius: "50%",
    },
    img: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" },
    header: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, fontFamily: "Inter, system-ui, sans-serif" },
    name: { textTransform: "capitalize", fontWeight: 700, fontSize: 16, color: "#333" },
    id: { color: "#666", fontSize: 12, fontFamily: "monospace" },
    types: { display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginTop: 6 },
    typeBadge: { padding: "4px 8px", borderRadius: 999, fontSize: 12, color: "#fff", textTransform: "capitalize", fontWeight: 500 },
    errorState: { color: "#999", fontSize: 12, textAlign: "center" }
};

const TYPE_COLORS = {
    grass: "#7AC74C", poison: "#A33EA1", fire: "#EE8130", water: "#6390F0",
    bug: "#A6B91A", normal: "#A8A77A", flying: "#A98FF3", electric: "#F7D02C",
    ground: "#E2BF65", rock: "#B6A136", fairy: "#D685AD", psychic: "#F95587",
    ghost: "#735797", steel: "#B7B7CE", ice: "#96D9D6", dragon: "#6F35FC",
    dark: "#705746",
};

const capitalize = (s) => (s && typeof s === 'string' ? s.charAt(0).toUpperCase() + s.slice(1) : "");
const formatId = (id) => `#${String(id).padStart(3, "0")}`;

const PokemonCard = ({ pokemon, onClick }) => {
    if (!pokemon || Object.keys(pokemon).length === 0) {
        return (
            <div style={{ ...styles.card, justifyContent: "center", height: 220, cursor: "default" }}>
                <div style={styles.errorState}>Cargando...</div>
            </div>
        );
    }

    const { id, name, sprites, types } = pokemon;
    const imgSrc = sprites?.other?.["official-artwork"]?.front_default || sprites?.front_default || null;

    return (
        // CAMBIO CRÍTICO: Usamos <button> en lugar de <div>
        <button
            style={styles.card}
            onClick={() => onClick && onClick(pokemon)}
            // Ya no necesitamos onKeyDown ni tabIndex ni role="button", el <button> lo trae nativo
            aria-label={`Ver detalles de ${name}`}
            type="button" // Importante para que no intente enviar formularios
            data-testid={`pokemon-card-${id}`}
        >
            <div style={styles.header}>
                <div style={styles.name}>{capitalize(name)}</div>
                <div style={styles.id}>{formatId(id)}</div>
            </div>

            <div style={styles.imgWrap}>
                {imgSrc ? (
                    <img style={styles.img} src={imgSrc} alt="" aria-hidden="true" loading="lazy" />
                ) : (
                    <div style={styles.errorState}>Sin imagen</div>
                )}
            </div>

            <div style={styles.types}>
                {(types || []).map((item) => {
                    const typeName = item?.type?.name;
                    if (!typeName) return null;
                    return (
                        <span key={typeName} style={{ ...styles.typeBadge, background: TYPE_COLORS[typeName] || "#777" }}>
                            {capitalize(typeName)}
                        </span>
                    );
                })}
            </div>
        </button>
    );
};

PokemonCard.propTypes = {
    pokemon: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        sprites: PropTypes.object,
        types: PropTypes.array,
    }),
    onClick: PropTypes.func,
};


// 3. PropTypes Estrictos: Esto ayuda a detectar datos mal formados durante el desarrollo/tests
PokemonCard.propTypes = {
    pokemon: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        sprites: PropTypes.shape({
            front_default: PropTypes.string,
            other: PropTypes.shape({
                "official-artwork": PropTypes.shape({
                    front_default: PropTypes.string
                })
            })
        }),
        types: PropTypes.arrayOf(
            PropTypes.shape({
                type: PropTypes.shape({
                    name: PropTypes.string.isRequired
                })
            })
        )
    }),
    onClick: PropTypes.func,
};

PokemonCard.defaultProps = {
    onClick: () => {},
    pokemon: null
};

// 4. React.memo para rendimiento en listas largas
export default memo(PokemonCard);