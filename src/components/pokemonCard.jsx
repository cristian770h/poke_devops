import React, { memo } from "react";
import PropTypes from "prop-types";

// Movemos los estilos y constantes fuera para no recrearlos en cada render
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
        border: "1px solid transparent", // Para que el focus sea visible sin mover el layout
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
    },
    imgWrap: {
        width: 160,
        height: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
        backgroundColor: "#f5f5f5", // Fondo suave por si la imagen es PNG transparente
        borderRadius: "50%",
    },
    img: {
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
    },
    header: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
        fontFamily: "Inter, system-ui, sans-serif",
    },
    name: {
        textTransform: "capitalize",
        fontWeight: 700,
        fontSize: 16,
        color: "#333",
    },
    id: {
        color: "#666",
        fontSize: 12,
        fontFamily: "monospace", // Mejor legibilidad para números
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
        fontWeight: 500,
    },
    errorState: {
        color: "#999",
        fontSize: 12,
        textAlign: "center"
    }
};

const TYPE_COLORS = {
    grass: "#7AC74C", poison: "#A33EA1", fire: "#EE8130", water: "#6390F0",
    bug: "#A6B91A", normal: "#A8A77A", flying: "#A98FF3", electric: "#F7D02C",
    ground: "#E2BF65", rock: "#B6A136", fairy: "#D685AD", psychic: "#F95587",
    ghost: "#735797", steel: "#B7B7CE", ice: "#96D9D6", dragon: "#6F35FC",
    dark: "#705746",
};

// Funciones puras utilitarias (fáciles de testear por separado si se exportaran)
const capitalize = (s) => (s && typeof s === 'string' ? s.charAt(0).toUpperCase() + s.slice(1) : "");
const formatId = (id) => `#${String(id).padStart(3, "0")}`;

const PokemonCard = ({ pokemon, onClick }) => {
    // 1. Manejo de estado de carga/error defensivo
    if (!pokemon || Object.keys(pokemon).length === 0) {
        return (
            <div 
                style={{ ...styles.card, justifyContent: "center", height: 220, cursor: "default" }}
                data-testid="pokemon-card-loading"
            >
                <div style={styles.errorState}>Cargando datos...</div>
            </div>
        );
    }

    const { id, name, sprites, types } = pokemon;

    // Obtención segura de la imagen
    const imgSrc =
        sprites?.other?.["official-artwork"]?.front_default ||
        sprites?.front_default ||
        null;

    // 2. Accesibilidad: Manejo de teclado (Enter/Espacio)
    const handleKeyDown = (e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick(pokemon);
        }
    };

    // Manejo de error de imagen (fallback visual)
    const handleImageError = (e) => {
        e.target.style.display = 'none'; // Oculta la imagen rota
        // Aquí podrías mostrar un icono de placeholder activando un estado local
    };

    return (
        <div
            style={styles.card}
            onClick={() => onClick && onClick(pokemon)}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`Ver detalles de ${name}`}
            data-testid={`pokemon-card-${id}`} // Hook para pruebas E2E
        >
            <div style={styles.header}>
                <div style={styles.name} data-testid="pokemon-name">
                    {capitalize(name)}
                </div>
                <div style={styles.id} data-testid="pokemon-id">
                    {formatId(id)}
                </div>
            </div>

            <div style={styles.imgWrap}>
                {imgSrc ? (
                    <img
                        style={styles.img}
                        src={imgSrc}
                        alt={`Ilustración de ${name}`}
                        loading="lazy"
                        onError={handleImageError}
                        data-testid="pokemon-image"
                    />
                ) : (
                    <div style={styles.errorState}>Sin imagen</div>
                )}
            </div>

            <div style={styles.types}>
                {(types || []).map((item) => {
                    // Verificación defensiva extra dentro del map
                    const typeName = item?.type?.name;
                    if (!typeName) return null;

                    const bg = TYPE_COLORS[typeName] || "#777";
                    return (
                        <span
                            key={typeName}
                            style={{ ...styles.typeBadge, background: bg }}
                            data-testid={`pokemon-type-${typeName}`}
                        >
                            {capitalize(typeName)}
                        </span>
                    );
                })}
            </div>
        </div>
    );
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