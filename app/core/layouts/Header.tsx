import {
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  HamburgerIcon,
  MoonIcon,
  SunIcon,
} from "@chakra-ui/icons"
import {
  Box,
  Button,
  Collapse,
  Flex,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { League } from "@prisma/client"
import logout from "app/auth/mutations/logout"
import getLeagues from "app/leagues/queries/getLeagues"
import { useMutation, useQuery, useRouter, useSession } from "blitz"
import { Suspense, useEffect } from "react"
import { FiCoffee, FiLogOut, FiSettings } from "react-icons/fi"
import CreateLeagueModal, {
  CREATE_LEAGUE_MODAL_LEAGUE_CREATED,
} from "../components/CreateLeagueModal"
import GradientTitle from "../components/GradientTitle"
import Emitter from "../eventEmitter/emitter"
import { useCurrentUser } from "../hooks/useCurrentUser"

export const HeaderFallback = () => {
  return (
    <Flex
      bg={useColorModeValue("white", "gray.800")}
      color={useColorModeValue("gray.600", "white")}
      minH={"60px"}
      py={{ base: 2 }}
      px={{ base: 4 }}
      borderBottom={1}
      borderStyle={"solid"}
      borderColor={useColorModeValue("gray.200", "gray.900")}
      align={"center"}
    ></Flex>
  )
}

const useNavItems = ({ onClickCreateNewLeague }: { onClickCreateNewLeague: () => void }) => {
  const { userId, isLoading } = useSession()
  const getLeaguesQueryDisabled = !userId && !isLoading

  const [leagues, { refetch }] = useQuery(
    getLeagues,
    {},
    {
      enabled: !getLeaguesQueryDisabled,
    }
  )

  useEffect(() => {
    const onLeagueCreated = () => {
      refetch()
    }
    Emitter.on(CREATE_LEAGUE_MODAL_LEAGUE_CREATED, onLeagueCreated)

    return () => {
      Emitter.off(CREATE_LEAGUE_MODAL_LEAGUE_CREATED, onLeagueCreated)
    }
  }, [refetch])

  if (getLeaguesQueryDisabled) {
    return []
  }

  const navItems: Array<NavItem> = [
    {
      label: "Leagues",
      children:
        leagues.length > 0
          ? [
              ...leagues.map((g) => ({
                label: g.name ?? "",
                subLabel: "",
                href: `/leagues/${g.id}`,
              })),
              {
                label: "New league",
                action: () => {
                  onClickCreateNewLeague()
                },
              },
            ]
          : undefined,
      href: leagues.length === 0 ? "/" : undefined,
    },
    {
      label: "Matches",
      href: "/matches",
    },
    {
      label: "Teams",
      href: "/teams",
    },
  ]

  return navItems
}

export default function Header() {
  const { isOpen, onToggle } = useDisclosure()
  const {
    isOpen: isOpenCreateModal,
    onOpen: onOpenCreateModal,
    onClose: onCloseCreateModal,
  } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode()
  const navItems = useNavItems({
    onClickCreateNewLeague: () => {
      onOpenCreateModal()
    },
  })

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "start", md: "start" }}>
          <Link
            href="/"
            display={{ md: "inherit", base: "none" }}
            _hover={{
              textDecor: "none",
            }}
          >
            <GradientTitle smaller>Euro 2020</GradientTitle>
          </Link>
          <Box
            display={{ base: "inherit", md: "none" }}
            position="absolute"
            left="50px"
            right="50px"
            top={0}
            h="60px"
          >
            <Flex h="100%" w="100%" alignItems="center" justifyContent="center">
              <Link
                href="/"
                h="24px"
                _hover={{
                  textDecor: "none",
                }}
              >
                <GradientTitle smaller>Euro 2020</GradientTitle>
              </Link>
            </Flex>
          </Box>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <Suspense fallback="">
              <DesktopNav navItems={navItems} />
            </Suspense>
          </Flex>
        </Flex>
        <Flex dir="row" alignItems="center" justifyContent="center">
          <Flex flex={1} cursor="pointer" onClick={toggleColorMode} mr="8px">
            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          </Flex>
          <Suspense fallback="Loading...">
            <HeaderUser />
          </Suspense>
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Suspense fallback="">
          <MobileNav navItems={navItems} />
        </Suspense>
      </Collapse>
      <CreateLeagueModal onClose={onCloseCreateModal} isOpen={isOpenCreateModal} />
    </Box>
  )
}

const HeaderUser = () => {
  const currentUser = useCurrentUser()
  const router = useRouter()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
      <Flex alignItems={"center"} display={{ base: "none", md: "inherit" }}>
        <Menu>
          <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"}>
            <Text>{currentUser.name}</Text>
          </MenuButton>
          <MenuList>
            <MenuItem
              icon={<FiSettings />}
              onClick={() => {
                router.push("/settings")
              }}
            >
              Settings
            </MenuItem>
            {/* <MenuItem icon={<FiCoffee />}>Buy me coffee</MenuItem> */}
            <MenuDivider />
            <MenuItem
              icon={<FiLogOut />}
              onClick={async () => {
                await logoutMutation()
              }}
            >
              Log out
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    )
  }

  return null
}

const DesktopNav: React.FunctionComponent<{
  navItems: Array<NavItem>
}> = ({ navItems }) => {
  const popoverContentBgColor = useColorModeValue("white", "gray.800")

  return (
    <Stack direction={"row"} spacing={4}>
      {navItems.map((navItem) => (
        <Box key={navItem.label}>
          <Menu>
            <MenuButton
              as={Link}
              href={navItem.href}
              onClick={() => {
                navItem.action?.()
              }}
              cursor="pointer"
            >
              {navItem.label}
            </MenuButton>
            {navItem?.children?.length ? (
              <MenuList boxShadow="xl" p={4} rounded="xl" minW="sm" bg={popoverContentBgColor}>
                <Stack>
                  {navItem?.children?.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </MenuList>
            ) : null}
          </Menu>
        </Box>
      ))}
    </Stack>
  )
}

const DesktopSubNav = ({ label, href, subLabel, action }: NavItem) => {
  return (
    <Link
      href={href}
      onClick={action ? action : () => {}}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("primary.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: action ? "secondary" : "primary.400" }}
            color={action ? "primary" : undefined}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"primary.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  )
}

const MobileNav: React.FunctionComponent<{
  navItems: Array<NavItem>
}> = ({ navItems }) => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  return (
    <Stack bg={useColorModeValue("white", "gray.800")} p={4} display={{ md: "none" }}>
      {[
        ...navItems,
        {
          label: `${currentUser?.name ?? "Settings"}`,
          children: [
            {
              label: "Settings",
              href: "/settings",
            },
            // {
            //   label: "Buy me coffee",
            //   href: "/coffee",
            // },
            {
              label: "Logout",
              action: async () => {
                await logoutMutation()
              },
            },
          ],
        },
      ].map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  )
}

const MobileNavItem = ({ label, children, href, action }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure()
  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text fontWeight={600} color={useColorModeValue("gray.600", "gray.200")}>
          {label}
        </Text>
        {children ? (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        ) : null}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children
            ? children.map((child) => {
                return (
                  <Link
                    key={child.label}
                    py={2}
                    href={child.href}
                    onClick={child.action ? child.action : () => {}}
                    color={child.action ? "primary" : undefined}
                    fontWeight={child.action ? "bold" : undefined}
                  >
                    {child.label}
                  </Link>
                )
              })
            : null}
        </Stack>
      </Collapse>
    </Stack>
  )
}

interface NavItem {
  label: string
  subLabel?: string
  children?: Array<NavItem>
  href?: string
  action?: () => void
}
