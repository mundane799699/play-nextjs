"use client";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Modal from "@/components/Modal";

import menuData from "./menuData";
import { Menu } from "@/types/menu";

const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const pathUrl = usePathname();
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: any) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  const meetPath = (menu: Menu) => {
    if (!menu.path) return false;
    if (menu.path === "/") return pathUrl === "/";
    return pathUrl.startsWith(menu.path);
  };

  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleMenuClick = (e: React.MouseEvent, menuItem: Menu) => {
    if (menuItem.needLogin && !user) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <header
        className={`ud-header left-0 top-0 z-40 flex w-full items-center ${
          sticky
            ? "shadow-nav fixed z-[999] border-b border-stroke bg-white/80 backdrop-blur-[5px] dark:border-dark-3/20 dark:bg-dark/10"
            : "absolute bg-transparent"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4">
              <Link
                href="/"
                className={`navbar-logo block w-full ${
                  sticky ? "py-2" : "py-5"
                } `}
              >
                {pathUrl !== "/" ? (
                  <>
                    <Image
                      src={`/images/logo/Readecho-orange.svg`}
                      alt="logo"
                      width={240}
                      height={30}
                      className="header-logo w-full dark:hidden"
                    />
                    <Image
                      src={`/images/logo/Readecho-white.svg`}
                      alt="logo"
                      width={240}
                      height={30}
                      className="header-logo hidden w-full dark:block"
                    />
                  </>
                ) : (
                  <>
                    <Image
                      src={`${
                        sticky
                          ? "/images/logo/Readecho-orange.svg"
                          : "/images/logo/Readecho-white.svg"
                      }`}
                      alt="logo"
                      width={140}
                      height={30}
                      className="header-logo w-full dark:hidden"
                    />
                    <Image
                      src={"/images/logo/Readecho-white.svg"}
                      alt="logo"
                      width={140}
                      height={30}
                      className="header-logo hidden w-full dark:block"
                    />
                  </>
                )}
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div>
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${
                      navbarOpen ? " top-[7px] rotate-45" : " "
                    } ${pathUrl !== "/" && "!bg-dark dark:!bg-white"} ${
                      pathUrl === "/" && sticky
                        ? "bg-dark dark:bg-white"
                        : "bg-white"
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${
                      navbarOpen ? "opacity-0 " : " "
                    } ${pathUrl !== "/" && "!bg-dark dark:!bg-white"} ${
                      pathUrl === "/" && sticky
                        ? "bg-dark dark:bg-white"
                        : "bg-white"
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${
                      navbarOpen ? " top-[-8px] -rotate-45" : " "
                    } ${pathUrl !== "/" && "!bg-dark dark:!bg-white"} ${
                      pathUrl === "/" && sticky
                        ? "bg-dark dark:bg-white"
                        : "bg-white"
                    }`}
                  />
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark-2 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 lg:dark:bg-transparent ${
                    navbarOpen
                      ? "visibility top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:ml-8 lg:flex lg:gap-x-8 xl:ml-14 xl:gap-x-12">
                    {menuData.map((menuItem, index) =>
                      menuItem.path ? (
                        <li key={index} className="group relative">
                          {pathUrl !== "/" ? (
                            <Link
                              onClick={(e) => {
                                navbarToggleHandler();
                                handleMenuClick(e, menuItem);
                              }}
                              scroll={false}
                              href={menuItem.path}
                              target={menuItem.newTab ? "_blank" : "_self"}
                              className={`ud-menu-scroll flex py-2 text-base text-dark group-hover:text-primary dark:text-white dark:group-hover:text-primary lg:inline-flex lg:px-0 lg:py-6 ${
                                meetPath(menuItem) && "text-primary"
                              }`}
                            >
                              {menuItem.title}
                            </Link>
                          ) : (
                            <Link
                              onClick={(e) => handleMenuClick(e, menuItem)}
                              scroll={false}
                              href={menuItem.path}
                              target={menuItem.newTab ? "_blank" : "_self"}
                              className={`ud-menu-scroll flex py-2 text-base lg:inline-flex lg:px-0 lg:py-6 ${
                                sticky
                                  ? "text-dark group-hover:text-primary dark:text-white dark:group-hover:text-primary"
                                  : "text-body-color dark:text-white lg:text-white"
                              } ${
                                pathUrl === menuItem?.path &&
                                sticky &&
                                "!text-primary"
                              }`}
                            >
                              {menuItem.title}
                            </Link>
                          )}
                        </li>
                      ) : (
                        <li className="submenu-item group relative" key={index}>
                          {pathUrl !== "/" ? (
                            <button
                              onClick={() => handleSubmenu(index)}
                              className={`ud-menu-scroll flex items-center justify-between py-2 text-base text-dark group-hover:text-primary dark:text-white dark:group-hover:text-primary lg:inline-flex lg:px-0 lg:py-6`}
                            >
                              {menuItem.title}

                              <span className="pl-1">
                                <svg
                                  className={`duration-300 lg:group-hover:rotate-180`}
                                  width="16"
                                  height="17"
                                  viewBox="0 0 16 17"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8.00039 11.9C7.85039 11.9 7.72539 11.85 7.60039 11.75L1.85039 6.10005C1.62539 5.87505 1.62539 5.52505 1.85039 5.30005C2.07539 5.07505 2.42539 5.07505 2.65039 5.30005L8.00039 10.525L13.3504 5.25005C13.5754 5.02505 13.9254 5.02505 14.1504 5.25005C14.3754 5.47505 14.3754 5.82505 14.1504 6.05005L8.40039 11.7C8.27539 11.825 8.15039 11.9 8.00039 11.9Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSubmenu(index)}
                              className={`ud-menu-scroll flex items-center justify-between py-2 text-base lg:inline-flex lg:px-0 lg:py-6 ${
                                sticky
                                  ? "text-dark group-hover:text-primary dark:text-white dark:group-hover:text-primary"
                                  : "text-white"
                              }`}
                            >
                              {menuItem.title}

                              <span className="pl-1">
                                <svg
                                  className={`duration-300 lg:group-hover:rotate-180`}
                                  width="16"
                                  height="17"
                                  viewBox="0 0 16 17"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8.00039 11.9C7.85039 11.9 7.72539 11.85 7.60039 11.75L1.85039 6.10005C1.62539 5.87505 1.62539 5.52505 1.85039 5.30005C2.07539 5.07505 2.42539 5.07505 2.65039 5.30005L8.00039 10.525L13.3504 5.25005C13.5754 5.02505 13.9254 5.02505 14.1504 5.25005C14.3754 5.47505 14.3754 5.82505 14.1504 6.05005L8.40039 11.7C8.27539 11.825 8.15039 11.9 8.00039 11.9Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </button>
                          )}

                          <div
                            className={`submenu relative left-0 top-full w-[250px] rounded-sm bg-white p-4 transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark-2 lg:invisible lg:absolute lg:top-[110%] lg:block lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                              openIndex === index ? "!-left-[25px]" : "hidden"
                            }`}
                          >
                            {menuItem?.submenu?.map((submenuItem: any, i) => (
                              <Link
                                href={submenuItem.path}
                                key={i}
                                className={`block rounded px-4 py-[10px] text-sm ${
                                  pathUrl === submenuItem.path
                                    ? "text-primary"
                                    : "text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary"
                                }`}
                              >
                                {submenuItem.title}
                              </Link>
                            ))}
                          </div>
                        </li>
                      ),
                    )}
                  </ul>
                </nav>
              </div>
              <div className="hidden items-center justify-end pr-16 sm:flex lg:pr-0">
                {user?.userName ? (
                  <>
                    <Link
                      href="/profile"
                      className={`loginBtn px-7 py-3 text-base font-medium transition-opacity hover:opacity-80 ${
                        !sticky && pathUrl === "/" ? "text-white" : "text-dark"
                      }`}
                    >
                      <span className="relative inline-flex items-center">
                        {user?.nickName}
                        {user?.memberType && (
                          <span className="ml-1 inline-flex h-[18px] items-center justify-center rounded-[3px] bg-[#e87549] px-0.5 text-[8px] font-medium leading-none text-white">
                            {user.memberType}
                          </span>
                        )}
                      </span>
                    </Link>
                    {pathUrl !== "/" || sticky ? (
                      <button
                        onClick={() => logout()}
                        className="signUpBtn rounded-lg bg-[#e87549] bg-opacity-100 px-4 py-2 text-sm font-medium text-white duration-300 ease-in-out hover:bg-opacity-80 hover:text-white"
                      >
                        退出登录
                      </button>
                    ) : (
                      <button
                        onClick={() => logout()}
                        className="signUpBtn rounded-lg bg-[#e87549] bg-opacity-90 px-4 py-2 text-sm font-medium text-white duration-300 ease-in-out hover:bg-opacity-100 hover:text-white"
                      >
                        退出登录
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {pathUrl !== "/" ? (
                      <>
                        <Link
                          href="/signin"
                          className="px-5 py-2 text-sm font-medium text-dark hover:opacity-70 dark:text-white"
                        >
                          登录
                        </Link>
                        <Link
                          href="/signup"
                          className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white duration-300 ease-in-out hover:bg-primary/90 dark:bg-white/10 dark:hover:bg-white/20"
                        >
                          注册
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/signin"
                          className={`px-5 py-2 text-sm font-medium hover:opacity-70 ${
                            sticky ? "text-dark dark:text-white" : "text-white"
                          }`}
                        >
                          登录
                        </Link>
                        <Link
                          href="/signup"
                          className={`rounded-lg px-5 py-2 text-sm font-medium text-white duration-300 ease-in-out ${
                            sticky
                              ? "bg-primary hover:bg-primary/90 dark:bg-white/10 dark:hover:bg-white/20"
                              : "bg-white/10 hover:bg-white/20"
                          }`}
                        >
                          注册
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="需要登录"
        message="请先登录后再访问此页面"
        confirmText="去登录"
        onConfirm={() => {
          setShowLoginModal(false);
          router.push("/signin");
        }}
      />
    </>
  );
};

export default Header;
