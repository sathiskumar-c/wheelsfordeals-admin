// React Imports
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Bootstrap Imports
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import Collapse from "react-bootstrap/Collapse";

// Material UI Imports
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

// Local Imports
import "./navbar.scss";
import JSON from "../../../data/navbar-menu.json";
import { getScreenInfo } from "../../../utils/getScreenSize";

function NavbarDeskTop() {
  const navigate = useNavigate();

  // Temporary profile data (remove once Redux auth is implemented)
  const tempProfileData = {
    name: "Musharof Chowdhury",
    email: "randomuser@pimjo.com",
    profileImage: "https://avatars.githubusercontent.com/u/1234567",
    isLoggedIn: true,
  };

  // Get user from Redux store (commented out until Redux auth is implemented)
  // const user = useSelector((state) => state.auth?.user);
  const user = tempProfileData;

  const { isMobile } = getScreenInfo();
  const [navbarData, setNavbarData] = useState(null);
  const [isMenuHovered, setIsMenuHovered] = useState(null);
  const [currentSubMenuData, setCurrentSubMenuData] = useState(null);
  const [currentMenuData, setCurrentMenuData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState({});
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [profileImageError, setProfileImageError] = useState(false);

  const handleMenuHoverandLeave = (response) => {
    setIsMenuHovered(response);
    const findCurrentMenu = navbarData?.navLinks.find(
      (item) => item.label === response
    );
    setCurrentMenuData(findCurrentMenu);
  };

  const handleSubMenuHover = (e, category) => {
    const findCurrentSubMenu = currentMenuData.categories.find(
      (item) => item.name === category
    );
    setCurrentSubMenuData(findCurrentSubMenu);
  };

  const handleNavigation = (subcategory) => {
    if (!subcategory || subcategory.trim() === "") {
      console.error("Invalid category, redirecting to home.");
      navigate("/error");
      return;
    }

    if (subcategory.startsWith("http")) {
      window.open(subcategory, "_blank", "noopener,noreferrer");
    } else {
      navigate(`/bikes/brands/${subcategory}`);
    }
  };

  const toggleMobileMenu = (menuLabel) => {
    setMobileMenuOpen((prev) => ({
      ...prev,
      [menuLabel]: !prev[menuLabel],
    }));
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleProfileImageError = () => {
    setProfileImageError(true);
  };

  const handleProfileMenuClick = (menuItem) => {
    handleCloseUserMenu();

    if (menuItem.action === "navigate" && menuItem.path) {
      navigate(menuItem.path);
    } else if (menuItem.action === "logout") {
      console.log("Logout clicked");
    }
  };

  useEffect(() => {
    setNavbarData(JSON);
  }, []);

  return (
    <>
      <Navbar expand="md" className="bg-body-tertiary navbar-menu">
        <Container>
          {isMobile && (
            <Navbar.Toggle
              aria-controls="offcanvasNavbar-md"
              className="border-0"
            />
          )}

          {!isMobile && (
            <Navbar.Brand as={Link} to="/">
              <img
                src={navbarData?.logo.url}
                alt={navbarData?.logo.alt}
                style={{ height: "40px", width: "auto" }}
              />
            </Navbar.Brand>
          )}

          <Navbar.Offcanvas
            className="offcanvasNavbar"
            id="offcanvasNavbar-md"
            placement="end"
          >
            <Offcanvas.Header closeButton>
              {isMobile ? (
                <Offcanvas.Title
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <img
                    src={navbarData?.logo.url}
                    alt={navbarData?.logo.alt}
                    style={{ height: "35px", width: "auto" }}
                  />
                  <span>{navbarData?.title}</span>
                </Offcanvas.Title>
              ) : (
                <Offcanvas.Title>
                  {navbarData?.ui.offcanvasTitle}
                </Offcanvas.Title>
              )}
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="flex-grow-1">
                {navbarData?.navLinks.map((navItem) => (
                  <div
                    key={navItem.label}
                    className="menu-container"
                    onMouseEnter={() =>
                      !isMobile && handleMenuHoverandLeave(navItem.label)
                    }
                    onMouseLeave={() =>
                      !isMobile && handleMenuHoverandLeave(null)
                    }
                  >
                    {isMobile && navItem.submenu ? (
                      <div
                        className="nav-link"
                        onClick={() => toggleMobileMenu(navItem.label)}
                        style={{ cursor: "pointer" }}
                      >
                        {navItem.label}
                        {mobileMenuOpen[navItem.label] ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </div>
                    ) : (
                      <Nav.Link as={Link} to={navItem.path}>
                        {navItem.label}
                        {navItem.submenu && !isMobile && (
                          <KeyboardArrowDownIcon
                            style={{
                              transform:
                                isMenuHovered === navItem.label
                                  ? navbarData?.ui.animations.arrowRotation
                                      .expanded
                                  : navbarData?.ui.animations.arrowRotation
                                      .collapsed,
                              transition:
                                navbarData?.ui.animations.arrowRotation
                                  .transition,
                            }}
                          />
                        )}
                      </Nav.Link>
                    )}
                    {!isMobile &&
                      isMenuHovered === navItem.label &&
                      navItem.submenu && (
                        <div className="sub-menu-desktop">
                          <div className="sub-menu-desktop-left">
                            <ul className="sub-menu-ul-left">
                              {currentMenuData?.categories?.length > 0 &&
                                currentMenuData?.categories.map((category) => (
                                  <li
                                    key={category.name}
                                    onMouseEnter={(e) =>
                                      handleSubMenuHover(e, category.name)
                                    }
                                  >
                                    {category.name}
                                    <KeyboardArrowRightIcon className="arrow_right_icon" />
                                  </li>
                                ))}
                            </ul>
                          </div>

                          <div className="sub-menu-desktop-right">
                            {currentSubMenuData?.section_type ===
                              "append_as_link" && (
                              <ul className="sub-menu-ul-right">
                                {currentSubMenuData.subcategories.map((sub) => (
                                  <li
                                    key={sub.id}
                                    id={sub.id}
                                    onClick={() => handleNavigation(sub.name)}
                                  >
                                    {sub.name}
                                  </li>
                                ))}
                              </ul>
                            )}

                            {currentSubMenuData?.section_type ===
                              "append_as_image" && (
                              <ul className="sub-menu-ul-right append_as_image">
                                {currentSubMenuData.subcategories.map((sub) => {
                                  return (
                                    <li
                                      className="append_as_image_li"
                                      key={sub.id}
                                      id={sub.id}
                                      onClick={() => handleNavigation(sub.path)}
                                    >
                                      <img
                                        className="append_as_image_img"
                                        id={sub.id}
                                        src={sub.image}
                                        alt={sub.alt}
                                        title={sub.alt}
                                        onError={(e) => {
                                          e.target.src = JSON.ui.defaultImage;
                                          console.error(
                                            `Image failed to load: ${sub.image}`
                                          );
                                        }}
                                      />
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        </div>
                      )}

                    {isMobile && navItem.submenu && (
                      <Collapse in={mobileMenuOpen[navItem.label]}>
                        <div className="sub-menu-mobile">
                          {navItem.categories?.map((category) => (
                            <div
                              key={category.name}
                              className="sub-menu-category"
                            >
                              <div className="category-title">
                                {category.name}
                              </div>

                              {category.section_type === "append_as_link" && (
                                <ul className="subcategory-list">
                                  {category.subcategories.map((sub) => (
                                    <li
                                      key={sub.id}
                                      onClick={() => {
                                        handleNavigation(sub.name);
                                        setMobileMenuOpen({});
                                      }}
                                    >
                                      {sub.name}
                                    </li>
                                  ))}
                                </ul>
                              )}

                              {category.section_type === "append_as_image" && (
                                <div className="subcategory-grid">
                                  {category.subcategories.map((sub) => (
                                    <div
                                      key={sub.id}
                                      className="subcategory-item"
                                      onClick={() => {
                                        handleNavigation(sub.path);
                                        setMobileMenuOpen({});
                                      }}
                                    >
                                      <img
                                        src={sub.image}
                                        alt={sub.alt}
                                        title={sub.alt}
                                        onError={(e) => {
                                          e.target.src = JSON.ui.defaultImage;
                                          console.error(
                                            `Image failed to load: ${sub.image}`
                                          );
                                        }}
                                      />
                                      {(category.name === "Select by Type" ||
                                        category.name ===
                                          "Browse by Fuel Type") && (
                                        <div
                                          style={{ fontWeight: "500" }}
                                          className="subcategory-name"
                                        >
                                          {sub.name}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </Collapse>
                    )}
                  </div>
                ))}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={navbarData?.profile.tooltip}>
              <IconButton
                className="profile-btn"
                onClick={handleOpenUserMenu}
                sx={{ p: 0 }}
              >
                {user?.isLoggedIn ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {!profileImageError ? (
                      <Avatar
                        alt={user.name}
                        src={navbarData?.profile.defaultAvatar}
                        onError={handleProfileImageError}
                        sx={{ width: 32, height: 32 }}
                      />
                    ) : (
                      <Avatar
                        alt="Default Profile"
                        src={navbarData?.profile.fallbackAvatar}
                        sx={{ width: 32, height: 32 }}
                      />
                    )}
                    <span
                      style={{
                        marginLeft: "8px",
                        color: "#1a1a1a",
                        fontSize: "14px",
                      }}
                    >
                      {user.name}{" "}
                      {anchorElUser ? (
                        <KeyboardArrowUpIcon sx={{ fontSize: 20 }} />
                      ) : (
                        <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
                      )}
                    </span>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <button
                      className="btn btn-outline-primary btn-login"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </button>
                    <button
                      className="btn btn-primary btn-signup"
                      onClick={() => navigate("/signup")}
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{
                mt: "45px",
                "& .MuiPaper-root": {
                  borderRadius: "12px",
                  minWidth: "200px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                },
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {user?.isLoggedIn && (
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                    {user.name}
                  </Typography>
                  <Typography sx={{ fontSize: "12px", color: "gray" }}>
                    {user.email}
                  </Typography>
                </Box>
              )}
              <MenuItem
                onClick={() =>
                  handleProfileMenuClick({
                    action: "navigate",
                    path: "/profile",
                  })
                }
              >
                <AccountCircleIcon sx={{ mr: 2, fontSize: 20 }} />
                <Typography>Edit profile</Typography>
              </MenuItem>
              <MenuItem
                onClick={() =>
                  handleProfileMenuClick({
                    action: "navigate",
                    path: "/settings",
                  })
                }
              >
                <FavoriteBorderIcon sx={{ mr: 2, fontSize: 20 }} />
                <Typography>Settings</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => handleProfileMenuClick({ action: "logout" })}
              >
                <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                <Typography>Log out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarDeskTop;
