import {
  Box,
  ChakraProps,
  Flex,
  Link,
  ResponsiveValue,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import * as CSS from "csstype"
import React, { createContext, useContext, useRef, useState } from "react"
import useOutsideAlerter from "../hooks/useOutsideAlerter"

const Summary: React.FunctionComponent<
  React.PropsWithChildren<
    {
      href?: string
    } & ChakraProps
  >
> = ({ children, href, ...props }) => {
  if (href) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  }
  return <Box {...props}>{children}</Box>
}

const ItemSeparator = () => {
  return <Box w="full" bg="gray.200" />
}

type AbsoluteValue = ResponsiveValue<CSS.Property.Right<string | 0 | number>>
const Items: React.FunctionComponent<
  React.PropsWithChildren<{
    top?: AbsoluteValue
    right?: AbsoluteValue
    left?: AbsoluteValue
    bottom?: AbsoluteValue
  }>
> = ({ children, ...props }) => {
  const { isOpen } = useContext(DropdownContext)

  return (
    <Flex
      direction="column"
      position="absolute"
      zIndex={999}
      borderRadius="md"
      boxShadow="md"
      bg={useColorModeValue("white", "gray.600")}
      display={isOpen ? "block" : "none"}
      {...props}
    >
      {children}
    </Flex>
  )
}

const Item: React.FunctionComponent<
  React.PropsWithChildren<{
    title?: string
    icon?: JSX.Element
    href?: string
    onClick?: (itemTitle?: string) => void
    render?: () => JSX.Element
    valueForOnClick?: string
  }>
> = ({ children, title, icon, onClick, href, render, valueForOnClick }) => {
  const bg = useColorModeValue("gray.100", "gray.500")
  const { isOpen, onClickItem } = useContext(DropdownContext)
  const renderChildren = () => (
    <Flex
      direction="row"
      alignItems="center"
      p="12px 20px"
      cursor="pointer"
      _hover={{
        bg,
      }}
      onClick={() => {
        onClick?.(title)
        onClickItem?.(valueForOnClick ?? "")
      }}
    >
      {children || (
        <>
          <Text mr="8px">{title}</Text>
          {icon || null}
        </>
      )}
    </Flex>
  )

  if (isOpen) {
    return href ? (
      <Link href={href}>{renderChildren()}</Link>
    ) : (
      <React.Fragment>{renderChildren()}</React.Fragment>
    )
  }

  return null
}

const DropdownContext = createContext<{
  isOpen: boolean
  onClickItem?: (key: string) => void
}>({
  isOpen: false,
})

interface DropdownProps {
  onClickItemWithKey?: (key: string) => void
  containerProps?: ChakraProps
}
const Dropdown: React.FC<React.PropsWithChildren<DropdownProps>> & {
  Items: typeof Items
  Item: typeof Item
  Summary: typeof Summary
  ItemSeperator?: typeof ItemSeparator
} = ({ children, onClickItemWithKey, containerProps = {}, ...props }) => {
  const [isOpen, setIsOpen] = useState(false)

  const onClickOutside = React.useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const wrapperRef = useRef<any>(null)
  useOutsideAlerter(wrapperRef, onClickOutside)

  const onClickItem = (key: string) => {
    onClickItemWithKey?.(key)
  }

  return (
    <DropdownContext.Provider value={{ isOpen, onClickItem }}>
      <Box
        ref={wrapperRef}
        cursor="pointer"
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        {...containerProps}
      >
        {children}
      </Box>
    </DropdownContext.Provider>
  )
}

Dropdown.Items = Items
Dropdown.Item = Item
Dropdown.Summary = Summary
Dropdown.ItemSeperator = ItemSeparator

export default Dropdown
