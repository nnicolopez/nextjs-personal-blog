import {
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { MdOutlineLanguage } from "react-icons/md";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const { pathname, asPath, query } = router;
  const [cookies, setCookie] = useCookies(["NEXT_LOCALE"]);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang, () => {
      setCookie("NEXT_LOCALE", lang);
      router.push({ pathname, query }, asPath, { locale: lang });
    });
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<MdOutlineLanguage />}
        textTransform={"uppercase"}
      >
        {i18n.language}
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          type="radio"
          onChange={(e) => handleLanguageChange(e as string)}
          value={router.locale}
        >
          <MenuItemOption value="en">{t("english")}</MenuItemOption>
          <MenuItemOption value="es">{t("spanish")}</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default LanguageSwitcher;
