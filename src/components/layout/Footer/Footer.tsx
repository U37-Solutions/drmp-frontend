import { Flex } from 'antd';
import { Footer as AntFooter } from 'antd/es/layout/layout';
import Text from 'antd/es/typography/Text';
import Image from 'next/image';
import Link from 'next/link';

import Logo, { LogoSize } from '@/shared/ui/components/Logo/Logo';

import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <AntFooter className={styles.footer}>
      <div className={styles.footer__inner}>
        <div className={styles.footer__brand}>
          <Text className={styles.footer__tagline}>
            Інформаційний портал для свідків і потерпілих від воєнних та інших міжнародних злочинів
          </Text>
          <Logo size={LogoSize.LARGE} />
        </div>

        <div className={styles.footer__separator} />

        <Text className={styles.footer__partnersLabel}>За підтримки:</Text>

        <div className={styles.footer__partners}>
          <div className={styles.footer__logos}>
            <div className={styles.footer__logoItem}>
              <Image width={110} height={55} src="/media/logo-iom-ua.png" alt="IOM" style={{ objectFit: 'contain' }} />
            </div>
            <div className={styles.footer__logoItem}>
              <Image
                className={styles.footer__logoLight}
                width={110}
                height={32}
                src="/media/logo-srn-en-white.png"
                alt="SRN"
                style={{ objectFit: 'contain' }}
              />
              <Image
                className={styles.footer__logoDark}
                width={110}
                height={32}
                src="/media/logo-srn-en-black.png"
                alt="SRN"
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
          <Text className={styles.footer__disclaimer}>
            Платформа розроблена за сприяння Міжнародної організації з міграції (МОМ) та фінансової підтримки мережі
            «Дії ООН проти сексуального насильства в умовах конфлікту».
          </Text>
        </div>

        <div className={styles.footer__separator} />

        <Flex justify="space-between" align="baseline" wrap>
          <div className={styles.footer__legal}>
            <Link className={styles.footer__legalLink} href="/terms">
              Правила та умови користування
            </Link>
          </div>

          <Text className={styles.footer__credits}>
            Розроблено агенцією{' '}
            <Link href="https://datadriven.group/" rel="noopener noreferrer" target="_blank">
              Data<strong>Driven</strong>
            </Link>
          </Text>
        </Flex>
      </div>
    </AntFooter>
  );
};

export default Footer;
