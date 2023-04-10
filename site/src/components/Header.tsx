import { chakra, Button, Flex, Link, WrapItem, Text, Wrap, Heading, Box } from '@chakra-ui/react';
import download from 'downloadjs';
import { Download, Github } from 'lucide-react';
import NextLink from 'next/link';
import { IconCustomizerDrawer } from './IconCustomizerDrawer';
import JSLogo from '../../public/framework-logos/js.svg';
import ReactLogo from '../../public/framework-logos/react.svg';
import VueLogo from '../../public/framework-logos/vue.svg';
import Vue3Logo from '../../public/framework-logos/vue-next.svg';
import PreactLogo from '../../public/framework-logos/preact.svg';
import AngularLogo from '../../public/framework-logos/angular.svg';
import FlutterLogo from '../../public/framework-logos/flutter.svg';
import SvelteLogo from '../../public/framework-logos/svelte.svg';
import { useCallback, useState } from 'react';
import { useCustomizeIconContext } from './CustomizeIconContext';
import { IconEntity } from '../types';
import generateZip, { IconContent } from 'src/lib/generateZip';

interface HeaderProps {
  data: IconEntity[];
}

const Header = ({ data }: HeaderProps) => {
  const [zippingIcons, setZippingIcons] = useState(false);
  const { iconsRef, strokeWidth, color, size } = useCustomizeIconContext();

  const downloadAllIcons = useCallback(async () => {
    setZippingIcons(true);

    let iconEntries: IconContent[] = Object.entries(iconsRef.current)
      .map(([name, svgEl]) => [
      name,
      svgEl.outerHTML,
    ]);

    // Fallback
    if (iconEntries.length === 0) {
      const getFallbackZip = (await import('../lib/getFallbackZip')).default
      iconEntries = getFallbackZip(data, { strokeWidth, color, size })
    }

    const zip = await generateZip(iconEntries);
    download(zip, 'lucide.zip');
    setZippingIcons(false);
  }, []);

  const repositoryUrl = 'https://github.com/lucide-icons/lucide';

  const packages = [
    {
      name: 'lucide',
      Logo: JSLogo,
      href: '/docs/lucide',
      label: 'Lucide documentation for JavaScript',
    },
    {
      name: 'lucide-react',
      Logo: ReactLogo,
      href: '/docs/lucide-react',
      label: 'Lucide documentation for React',
    },
    {
      name: 'lucide-react-native',
      Logo: ReactLogo,
      href: '/docs/lucide-react-native',
      label: 'Lucide documentation for React Native',
    },
    {
      name: 'lucide-vue',
      Logo: VueLogo,
      href: '/docs/lucide-vue',
      label: 'Lucide documentation for Vue',
    },
    {
      name: 'lucide-vue-next',
      Logo: Vue3Logo,
      href: '/docs/lucide-vue-next',
      label: 'Lucide documentation for Vue 3',
    },
    {
      name: 'lucide-svelte',
      Logo: SvelteLogo,
      href: '/docs/lucide-svelte',
      label: 'Lucide documentation for Svelte',
    },
    {
      name: 'lucide-preact',
      Logo: PreactLogo,
      href: '/docs/lucide-preact',
      label: 'Lucide documentation for Preact',
    },
    {
      name: 'lucide-angular',
      Logo: AngularLogo,
      href: '/docs/lucide-angular',
      label: 'Lucide documentation for Angluar',
    },
    {
      name: 'lucide-flutter',
      Logo: FlutterLogo,
      href: '/docs/lucide-flutter',
      label: 'Lucide documentation for Flutter',
    },
  ];

  return (
    <Box maxW="1250px" mx="auto">
      <Flex direction="column" align="center" justify="center" py={12}>
        <Heading as="h1" fontSize="4xl" mb="4" textAlign="center" maxWidth="650px" fontWeight={500}>
          Beautiful &amp; consistent icon toolkit <chakra.span color='brand.500'>made by the community.</chakra.span>
        </Heading>
        <Text fontSize="lg" as="p" textAlign="center" mb="1">
          Open-source project and a fork of{' '}
          <Link href="https://github.com/feathericons/feather" isExternal>
            Feather Icons
          </Link>
          . <br />
          We're expanding the icon set as much as possible while keeping it nice-looking -{' '}
          <Link href={repositoryUrl} isExternal>
            join us
          </Link>
          !
        </Text>
        <Wrap
          marginTop={4}
          marginBottom={6}
          spacing={{ base: 4, lg: 6 }}
          justify="center"
          align="center"
        >
          <WrapItem flexBasis="100%" style={{ marginBottom: 0 }}>
            <Link as={NextLink} href="/packages" _hover={{ opacity: 0.8 }} marginX="auto">
              <Text fontSize="md" opacity={0.5} as="p" textAlign="center" width="100%">
                Available for:
              </Text>
            </Link>
          </WrapItem>
          {packages.map(({ name, href, Logo, label }) => (
            <WrapItem key={name}>
              <Link as={NextLink} href={href} key={name} _hover={{ opacity: 0.8 }} aria-label={label}>
                <Logo />
              </Link>
            </WrapItem>
          ))}
          <WrapItem>
            <Link as={NextLink} href="/packages" _hover={{ opacity: 0.8 }} marginX="auto">
              <Text fontSize="md" opacity={0.5}>More options</Text>
            </Link>
          </WrapItem>
        </Wrap>
      </Flex>
    </Box>
  );
};

export default Header;
