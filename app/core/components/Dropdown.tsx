import {
  Box,
  ChakraComponent,
  ChakraStyleProps,
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
  {
    href?: string
  } & ChakraStyleProps
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
const Items: React.FunctionComponent<{
  top?: AbsoluteValue
  right?: AbsoluteValue
  left?: AbsoluteValue
  bottom?: AbsoluteValue
}> = ({ children, ...props }) => {
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

const Item: React.FunctionComponent<{
  title?: string
  icon?: JSX.Element
  href?: string
  onClick?: (itemTitle?: string) => void
  render?: () => JSX.Element
}> = ({ children, title, icon, onClick, href, render }) => {
  const bg = useColorModeValue("gray.100", "gray.500")
  const { isOpen } = useContext(DropdownContext)
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

const DropdownContext = createContext({
  isOpen: false,
})

interface DropdownProps {
  onClickItemWithKey?: (key: string) => void
  containerProps?: ChakraStyleProps
}
const Dropdown: React.FunctionComponent<DropdownProps> & {
  Items: typeof Items
  Item: typeof Item
  Summary: typeof Summary
  ItemSeperator?: typeof ItemSeparator
} = ({ children, onClickItemWithKey, containerProps = {}, ...props }) => {
  let summaryChild: any
  const otherChildren: any[] = []
  const [isOpen, setIsOpen] = useState(false)

  // React.Children.forEach(
  //   (children as any[]).filter((c) => !!c),
  //   (child: any) => {
  //     if (child.type.name === "Summary") {
  //       summaryChild = child
  //     } else if (child.type.name === "Item") {
  //       otherChildren.push(
  //         React.cloneElement(child, {
  //           ...child.props,
  //           onClick: () => {
  //             child.props?.onClick?.()
  //             onClickItemWithKey?.(child.key)
  //             onClickOutside()
  //           },
  //         })
  //       )
  //     } else {
  //       otherChildren.push(child)
  //     }
  //   }
  // )

  const onClickOutside = React.useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const wrapperRef = useRef<any>(null)
  useOutsideAlerter(wrapperRef, onClickOutside)

  // if (otherChildren.length === 0) {
  //   return summaryChild
  // }

  return (
    <DropdownContext.Provider value={{ isOpen }}>
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
