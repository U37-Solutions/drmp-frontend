import { Typography } from "antd";
import { Footer as AntFooter } from "antd/es/layout/layout";
import Logo, { LogoSize } from "@/shared/ui/components/Logo/Logo";
import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <AntFooter className={styles.footer}>
      <div className={styles.footer__content}>
        <div className={styles.footer__contentMain}>
          <Logo size={LogoSize.LARGE} />
          <Typography style={{ margin: 0 }}>
            Інформаційний портал для свідків і потерпілих від воєнних та інших міжнародних злочинів
          </Typography>
        </div>

        <div className={styles.footer__contentSponsors}>
          <div className={styles.footer__contentSponsorsLogos}>
            <img src="/media/logo-iom-ua.jpg" alt="IOM" />
            <img src="/media/logo-srn-en-white.jpeg" alt="SRN" />
          </div>

          <Typography style={{ margin: 0, maxWidth: 700 }}>
            Дисклеймер:<br />
            Платформа розроблена за сприяння Міжнародної організації з міграції (МОМ) та
            фінансової підтримки мережі «Дії ООН проти сексуального насильства
            в умовах конфлікту»
          </Typography>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
