import React from "react";
import PropTypes from "prop-types";

/**
 * PokemonCard - Componente para mostrar una carta de Pokémon.
 * Uso:
 * <PokemonCard pokemon={pokemon} onClick={() => handleSelect(pokemon)} />
 *
 * pokemon esperado:
 * {
 *   id: 1,
 *   name: "bulbasaur",
 *   sprites: { front_default: "..." },
 *   types: [{ type: { name: "grass" } }, { type: { name: "poison" } }]
 * }
 */

const styles = {
    card: {
        width: 220,
        borderRadius: 12,
        boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
        padding: 12,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
    },
    imgWrap: {
        width: 160,
        height: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    img: {
        maxWidth: "100%",
        maxHeight: "100%",
    },
    header: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
        fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    },
    name: {
        textTransform: "capitalize",
        fontWeight: 700,
        fontSize: 16,
    },
    id: {
        color: "#666",
        fontSize: 12,
    },
    types: {
        display: "flex",
        gap: 6,
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: 6,
    },
    typeBadge: {
        padding: "4px 8px",
        borderRadius: 999,
        fontSize: 12,
        color: "#fff",
        textTransform: "capitalize",
    },
};

/* pequeño mapeo de colores por tipo; se puede extender */
const TYPE_COLORS = {
    grass: "#7AC74C",
    poison: "#A33EA1",
    fire: "#EE8130",
    water: "#6390F0",
    bug: "#A6B91A",
    normal: "#A8A77A",
    flying: "#A98FF3",
    electric: "#F7D02C",
    ground: "#E2BF65",
    rock: "#B6A136",
    fairy: "#D685AD",
    psychic: "#F95587",
    ghost: "#735797",
    steel: "#B7B7CE",
    ice: "#96D9D6",
    dragon: "#6F35FC",
    dark: "#705746",
};

/* capitaliza nombre */
const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

/* formatea id a #001 */
const formatId = (id) => `#${String(id).padStart(3, "0")}`;

export default function PokemonCard({ pokemon, onClick }) {
    if (!pokemon) {
        return (
            <div style={{ ...styles.card, justifyContent: "center", height: 220 }}>
                <div>Cargando...</div>
            </div>
        );
    }

    const img =
        pokemon.sprites?.other?.["official-artwork"]?.front_default ||
        pokemon.sprites?.front_default ||
        "";

    return (
        <div style={styles.card} onClick={() => onClick && onClick(pokemon)} role="button" tabIndex={0}>
            <div style={styles.header}>
                <div style={styles.name}>{capitalize(pokemon.name)}</div>
                <div style={styles.id}>{formatId(pokemon.id)}</div>
            </div>

            <div style={styles.imgWrap}>
                {img ? (
                    <img style={styles.img} src={img} alt={pokemon.name} loading="lazy" />
                ) : (
                    <div style={{ color: "#999" }}>Sin imagen</div>
                )}
            </div>

            <div style={styles.types}>
                {(pokemon.types || []).map((t) => {
                    const typeName = t.type?.name || "";
                    const bg = TYPE_COLORS[typeName] || "#777";
                    return (
                        <span
                            key={typeName}
                            style={{ ...styles.typeBadge, background: bg }}
                        >
                            {capitalize(typeName)}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

PokemonCard.propTypes = {
    pokemon: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        sprites: PropTypes.object,
        types: PropTypes.array,
    }),
    onClick: PropTypes.func,
};