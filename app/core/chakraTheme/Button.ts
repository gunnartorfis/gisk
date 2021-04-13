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
      px: 4, // <-- px is short for paddingLeft and paddingRight
      py: 3, // <-- py is short for paddingTop and paddingBottom
    },
    md: {
      fontSize: "md",
      px: 6, // <-- these values are tokens from the design system
      py: 4, // <-- these values are tokens from the design system
    },
  },
  // Two variants: outline and solid
  variants: {
    solid: {
      bg: "primary",
      color: "white",
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
        color: "primarydarker",
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
