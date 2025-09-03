"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  Search,
  ShoppingBag,
  User,
  Heart,
  Bell,
  Home,
  Shirt,
  Phone,
  UserPlus,
  Settings,
  Shield,
  FileText,
  RotateCcw,
  Sparkles,
} from "lucide-react"

const mainNavLinks = [
  {
    href: "/",
    label: "Home",
    icon: Home,
    description: "Back to homepage",
  },
  {
    href: "/dresses",
    label: "Dresses",
    icon: Sparkles,
    description: "Elegant dresses collection",
    badge: "New",
  },
  {
    href: "/tops",
    label: "Tops",
    icon: Shirt,
    description: "Stylish tops & blouses",
  },
  {
    href: "/new-arrivals",
    label: "New Arrivals",
    icon: Sparkles,
    description: "Latest fashion trends",
    badge: "Hot",
  },
  {
    href: "/contact",
    label: "Contact",
    icon: Phone,
    description: "Get in touch with us",
  },
]

const accountLinks = [
  {
    href: "/registration",
    label: "Registration",
    icon: UserPlus,
    description: "Create new account",
  },
  {
    href: "/account",
    label: "My Account",
    icon: User,
    description: "Manage your account",
  },
]

const legalLinks = [
  {
    href: "/privacy_policy",
    label: "Privacy Policy",
    icon: Shield,
    description: "How we protect your data",
  },
  {
    href: "/return_policy",
    label: "Return Policy",
    icon: RotateCcw,
    description: "Return & exchange info",
  },
  {
    href: "/terms_conditions",
    label: "Terms & Conditions",
    icon: FileText,
    description: "Terms of service",
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(3) // Mock cart count
  const [wishlistCount, setWishlistCount] = useState(5) // Mock wishlist count

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActivePath = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span>📍 Abu-Falah, Ramallah</span>
            <span>📞 +972-592-845-459</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <span>✨ Free shipping on orders over $50</span>
            <span>🎉 New arrivals weekly</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
            : "bg-white/90 backdrop-blur-sm shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Sonaa Moda
                </h1>
                <p className="text-xs text-gray-500">Style & Elegance</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <NavigationMenu>
                <NavigationMenuList className="space-x-2">
                  {/* Main Navigation Items */}
                  {mainNavLinks.map((link) => (
                    <NavigationMenuItem key={link.href}>
                      <Link href={link.href} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-rose-50 hover:text-rose-600 focus:bg-rose-50 focus:text-rose-600 focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                            isActivePath(link.href) ? "bg-rose-100 text-rose-700 font-semibold" : "text-gray-700"
                          }`}
                        >
                          <link.icon className="h-4 w-4 mr-2" />
                          {link.label}
                          {link.badge && (
                            <Badge className="ml-2 bg-green-500 text-white text-xs px-1 py-0">{link.badge}</Badge>
                          )}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}

                  {/* Account Dropdown */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-gray-700 hover:text-rose-600">
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-6 w-80">
                        <div className="row-span-3">
                          <NavigationMenuLink asChild>
                            <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-rose-500 to-pink-600 p-6 no-underline outline-none focus:shadow-md">
                              <User className="h-6 w-6 text-white" />
                              <div className="mb-2 mt-4 text-lg font-medium text-white">Your Account</div>
                              <p className="text-sm leading-tight text-rose-100">
                                Manage your profile, orders, and preferences
                              </p>
                            </div>
                          </NavigationMenuLink>
                        </div>
                        <div className="grid gap-2">
                          {accountLinks.map((link) => (
                            <Link key={link.href} href={link.href}>
                              <div className="group grid h-auto w-full items-center justify-start gap-1 rounded-md p-3 text-sm hover:bg-rose-50 hover:text-rose-600">
                                <div className="flex items-center space-x-2">
                                  <link.icon className="h-4 w-4" />
                                  <div className="text-sm font-medium leading-none">{link.label}</div>
                                </div>
                                <div className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                  {link.description}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* Legal Dropdown */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-gray-700 hover:text-rose-600">
                      <Settings className="h-4 w-4 mr-2" />
                      Legal
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-6 w-80">
                        {legalLinks.map((link) => (
                          <Link key={link.href} href={link.href}>
                            <div className="group grid h-auto w-full items-center justify-start gap-1 rounded-md p-3 text-sm hover:bg-rose-50 hover:text-rose-600">
                              <div className="flex items-center space-x-2">
                                <link.icon className="h-4 w-4" />
                                <div className="text-sm font-medium leading-none">{link.label}</div>
                              </div>
                              <div className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                {link.description}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-rose-600 hidden sm:flex">
                <Search className="h-5 w-5" />
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-rose-600 relative hidden sm:flex">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full p-0 flex items-center justify-center">
                  2
                </Badge>
              </Button>

              {/* Wishlist */}
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-rose-600 relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full p-0 flex items-center justify-center">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>

              {/* Shopping Cart */}
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-rose-600 relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs w-5 h-5 rounded-full p-0 flex items-center justify-center">
                    {cartCount}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden text-gray-700">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <span>Sonaa Moda Style</span>
                    </SheetTitle>
                    <SheetDescription>Navigate through our elegant fashion collection</SheetDescription>
                  </SheetHeader>

                  <div className="mt-8 space-y-6">
                    {/* Main Navigation */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Main Menu</h3>
                      <div className="space-y-2">
                        {mainNavLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                              isActivePath(link.href)
                                ? "bg-rose-100 text-rose-700"
                                : "text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                            }`}
                          >
                            <link.icon className="h-5 w-5" />
                            <span>{link.label}</span>
                            {link.badge && (
                              <Badge className="ml-auto bg-green-500 text-white text-xs">{link.badge}</Badge>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Account Section */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Account</h3>
                      <div className="space-y-2">
                        {accountLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                              isActivePath(link.href)
                                ? "bg-rose-100 text-rose-700"
                                : "text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                            }`}
                          >
                            <link.icon className="h-5 w-5" />
                            <span>{link.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Legal Section */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Legal & Support</h3>
                      <div className="space-y-2">
                        {legalLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                              isActivePath(link.href)
                                ? "bg-rose-100 text-rose-700"
                                : "text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                            }`}
                          >
                            <link.icon className="h-5 w-5" />
                            <span>{link.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Info</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>📍 Abu-Falah, Ramallah</p>
                        <p>📞 +972-592-845-459</p>
                        <p>✉️ sonaamodastyle@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb for non-home pages */}
      {pathname !== "/" && (
        <div className="bg-gray-50 border-b border-gray-200 py-3 px-4">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-rose-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">
                {mainNavLinks.find((link) => link.href === pathname)?.label ||
                  accountLinks.find((link) => link.href === pathname)?.label ||
                  legalLinks.find((link) => link.href === pathname)?.label ||
                  "Page"}
              </span>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
