const ButtonTheme = {
  // The styles all button have in common
  baseStyle: {
    fontWeight: "bold",
    textTransform: "uppercase",
    borderRadius: "base", // <-- border radius is same for all variants and sizes
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: "sm",
    },
    md: {
      fontSize: "md",
    },
  },
  // Two variants: outline and solid
  variants: {
    solid: {
      bg: "primary",
      color: "white",
      borderRadius: "400px",
      ":hover": {
        bg: "primarydarker",
      },
    },
    outline: {
      border: "2px solid",
      borderColor: "primary",
      color: "primary",
    },
    text: {
      color: "primary",
      padding: "16px",
      ":hover": {
        color: "secondary",
      },
    },
    danger: {
      bg: "danger",
      color: "white",
      borderRadius: "400px",
      ":hover": {
        bg: "dangerdarker",
      },
    },
  },
  // The default size and variant values
  defaultProps: {
    size: "md",
    variant: "solid",
  },
}

export default ButtonTheme
