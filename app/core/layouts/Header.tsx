import { useSession } from "@blitzjs/auth"
import { useRouter } from "next/router"
import { useMutation, useQuery } from "@blitzjs/rpc"
import {
  AddIcon,
  ChevronDownIcon,
  CloseIcon,
  HamburgerIcon,
  MoonIcon,
  SunIcon,
} from "@chakra-ui/icons"
import {
  Box,
  Collapse,
  Flex,
  Icon,
  IconButton,
  Link,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import logout from "app/auth/mutations/logout"
import { LeagueInviteModal } from "app/leagues/components/LeagueInvite"
import getLeagues from "app/leagues/queries/getLeagues"
import updateUserLanguage from "app/users/mutations/updateUserLanguage"
import dayjs from "dayjs"
import { Suspense, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { FiCoffee, FiLogOut, FiSettings } from "react-icons/fi"
import CreateLeagueModal, {
  CREATE_LEAGUE_MODAL_LEAGUE_CREATED,
} from "../components/CreateLeagueModal"
import Dropdown from "../components/Dropdown"
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

const useNavItems = ({
  onClickCreateNewLeague,
  onClickJoinNewLeague,
}: {
  onClickCreateNewLeague: () => void
  onClickJoinNewLeague: () => void
}) => {
  const { userId, isLoading } = useSession()
  const user = useCurrentUser()
  const { t } = useTranslation()
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

  if (!leagues) {
    return [
      {
        label: t("NEW_LEAGUE"),
        action: () => {
          onClickCreateNewLeague()
        },
        icon: <AddIcon w={3} h={3} />,
      },
    ]
  }

  const navItems: Array<NavItem> = [
    {
      label: t("LEAGUES"),
      children:
        leagues.length > 0
          ? [
              ...leagues.map((g) => ({
                label: g.name ?? "",
                subLabel: "",
                href: `/leagues/${g.id}`,
              })),
              {
                label: t("NEW_LEAGUE"),
                action: () => {
                  onClickCreateNewLeague()
                },
                icon: <AddIcon w={3} h={3} />,
              },
              {
                label: t("NEW_LEAGUE_JOIN"),
                action: () => {
                  onClickJoinNewLeague()
                },
                icon: <AddIcon w={3} h={3} />,
              },
            ]
          : undefined,
      href: leagues.length === 0 ? "/" : undefined,
    },
    {
      label: t("MATCHES"),
      href: "/matches",
    },
    {
      label: t("TEAMS"),
      href: "/teams",
    },
    {
      label: t("QUESTIONS"),
      href: "/questions",
    },
    {
      label: t("SCORING"),
      href: "/scoring",
    },
    {
      label: t("LEADERBOARDS_TITLE"),
      href: "/leaderboards",
    },
  ]

  if (user?.role === "ADMIN") {
    navItems.push({
      label: t("ADMIN"),
      children:
        leagues.length > 0
          ? [
              {
                label: "Úrslit leikja",
                href: "/adminMatches",
              },
              {
                label: "Deildir",
                href: "/adminLeagues",
              },
            ]
          : undefined,
    })
  }

  return navItems
}

const getFlagBasedOnLanguage = (language: string = "is") => {
  const spanProps = {
    role: "img",
    "aria-label": language,
    fontSize: "40px",
  }

  let flag = (
    // eslint-disable-next-line jsx-a11y/accessible-emoji
    <span {...spanProps}>🇺🇸</span>
  )
  if (language === "is") {
    flag = (
      // eslint-disable-next-line jsx-a11y/accessible-emoji
      <span {...spanProps}>🇮🇸</span>
    )
  }

  return flag
}

export default function Header() {
  const { isOpen, onToggle } = useDisclosure()
  const {
    isOpen: isOpenCreateModal,
    onOpen: onOpenCreateModal,
    onClose: onCloseCreateModal,
  } = useDisclosure()
  const {
    isOpen: isOpenLeagueInvite,
    onOpen: onOpenLeagueInvite,
    onClose: onCloseLeagueInvite,
  } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode()
  const navItems = useNavItems({
    onClickCreateNewLeague: () => {
      onOpenCreateModal()
    },
    onClickJoinNewLeague: () => {
      onOpenLeagueInvite()
    },
  })
  const { t, i18n } = useTranslation()
  const currentUser = useCurrentUser()
  const [updateUserLanguageMutation] = useMutation(updateUserLanguage)

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.700")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        {navItems.length > 0 ? (
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
        ) : null}
        <Flex flex={{ base: 1 }} justify={{ base: "start", md: "start" }}>
          <Link
            href="/"
            display={{ md: "inherit", base: "none" }}
            _hover={{
              textDecor: "none",
            }}
          >
            <GradientTitle smaller>{t("NAV_BAR_MOBILE_TITLE")}</GradientTitle>
          </Link>
          <Box
            display={{ base: "inherit", md: "none" }}
            position="absolute"
            left={["90px", "120px"]}
            right={["90px", "120px"]}
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
                <GradientTitle smaller>{t("NAV_BAR_MOBILE_TITLE")}</GradientTitle>
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
          <Flex flex={1} direction="row" alignItems="center">
            <Box cursor="pointer" onClick={toggleColorMode}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Box>
          </Flex>
          <Suspense fallback="">
            <HeaderUser />
          </Suspense>
          <Dropdown
            containerProps={{
              marginLeft: "16px",
            }}
            onClickItemWithKey={(language) => {
              i18n.changeLanguage(language)
              dayjs.locale(language)
              if (currentUser) {
                updateUserLanguageMutation({
                  language,
                })
              }
            }}
          >
            <Dropdown.Summary>{getFlagBasedOnLanguage(i18n.language)}</Dropdown.Summary>
            <Dropdown.Items right="16px" top="60px">
              <Dropdown.Item valueForOnClick="is">{getFlagBasedOnLanguage("is")}</Dropdown.Item>
              <Dropdown.Item valueForOnClick="en">{getFlagBasedOnLanguage("en")}</Dropdown.Item>
            </Dropdown.Items>
          </Dropdown>
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Suspense fallback="">
          <MobileNav navItems={navItems} />
        </Suspense>
      </Collapse>
      <CreateLeagueModal onClose={onCloseCreateModal} isOpen={isOpenCreateModal} />
      <LeagueInviteModal isOpen={isOpenLeagueInvite} onRequestClose={onCloseLeagueInvite} />
    </Box>
  )
}

const HeaderUser = () => {
  const session = useSession()
  const currentUser = useCurrentUser({ enabled: !!session.userId })
  const router = useRouter()
  const [logoutMutation] = useMutation(logout)
  const { t } = useTranslation()

  if (currentUser) {
    return (
      <Box display={{ base: "none", md: "inherit" }} ml="8px">
        <Dropdown>
          <Dropdown.Summary>{currentUser.name}</Dropdown.Summary>
          <Dropdown.Items right="16px" top="60px">
            <Dropdown.Item
              key="settings"
              title={t("SETTINGS")}
              icon={<FiSettings />}
              onClick={() => {
                router.push("/settings", undefined, { shallow: true })
              }}
            ></Dropdown.Item>
            <Dropdown.Item
              key="coffee"
              title={t("BUY_ME_A_COFFEE")}
              icon={<FiCoffee />}
              onClick={() => {
                window.open("https://www.buymeacoffee.com/gunnar", "_blank")
              }}
            ></Dropdown.Item>
            <Dropdown.Item
              key="logout"
              title={t("LOGOUT")}
              icon={<FiLogOut />}
              onClick={async () => {
                await logoutMutation()
              }}
            ></Dropdown.Item>
          </Dropdown.Items>
        </Dropdown>
      </Box>
    )
  }

  return null
}

const DesktopNav: React.FunctionComponent<{
  navItems: Array<NavItem>
}> = ({ navItems }) => {
  return (
    <Flex direction="row" alignItems="center">
      {navItems.map((navItem) => (
        <Dropdown key={navItem.label}>
          <Dropdown.Summary href={navItem.href} marginRight="16px">
            {navItem.label}
          </Dropdown.Summary>
          <Dropdown.Items left="140px" top="60px">
            {navItem.children?.map((navItem) => (
              <Dropdown.Item
                title={navItem.label}
                key={navItem.label}
                icon={navItem.icon}
                href={navItem.href}
                onClick={() => {
                  navItem.action?.()
                }}
              />
            ))}
          </Dropdown.Items>
        </Dropdown>
      ))}
    </Flex>
  )
}

const MobileNav: React.FunctionComponent<{
  navItems: Array<NavItem>
}> = ({ navItems }) => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  let navItemsWithSettings = navItems
  if (currentUser) {
    navItemsWithSettings = [
      ...navItems,
      {
        label: `${currentUser?.name ?? "Settings"}`,
        children: [
          {
            label: "Settings",
            href: "/settings",
          },
          {
            label: "Buy me coffee",
            action: () => {
              window.open("https://www.buymeacoffee.com/gunnar", "_blank")
            },
          },
          {
            label: "Logout",
            action: async () => {
              await logoutMutation()
            },
          },
        ],
      },
    ]
  }

  return (
    <Stack bg={useColorModeValue("white", "gray.800")} p={4} display={{ md: "none" }}>
      {navItemsWithSettings.map((navItem) => (
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
  icon?: JSX.Element
}
