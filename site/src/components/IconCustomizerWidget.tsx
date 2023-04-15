import {
  Box,
  BoxProps,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Tooltip,
  useColorModeValue,
  useMultiStyleConfig,
  VisuallyHidden
} from '@chakra-ui/react';
import {
  Atom,
  Calendar,
  Camera,
  Coins,
  Cookie,
  Expand as ExpandIcon,
  LucideProps,
  Music,
  Palette as PaletteIcon,
  Rocket,
  Scale as ScaleIcon,
  Star,
  ThumbsUp
} from 'lucide-react';
import {useMemo, useState} from 'react';

interface IconCustomizerProperty<T extends string | number = number, P extends 'size' | 'weight' | 'color' = 'size' | 'weight' | 'color'> {
  name: P,
  icon: (props: LucideProps) => JSX.Element,
  label: string,
  set: (value: T) => void,
  value: T,
  options: {
    value: T,
    label: string,
  }[]
}

const IconCustomizerWidget = ({...rest}: BoxProps) => {
  const styles = useMultiStyleConfig('IconCustomizerWidget', {});
  const icons: { [key: string]: (props: LucideProps) => JSX.Element } = {
    'calendar': Calendar,
    'thumbs-up': ThumbsUp,
    'star': Star,
    'camera': Camera,
    'rocket': Rocket,
    'cookie': Cookie,
    'music': Music,
    'coins': Coins,
    'atom': Atom,
  };

  const [selectedIcon, setIcon] = useState<keyof typeof icons>(Object.keys(icons).at(0));
  const [selectedColor, setColor] = useState<string>('brand');
  const [selectedSize, setSize] = useState<number>(24);
  const [selectedWeight, setWeight] = useState<number>(2);
  const [selectedProperty, setProperty] = useState<'size' | 'weight' | 'color'>('size');

  const sizeMultiplier = 3;

  const customizationOptions: IconCustomizerProperty<any>[] = [
    {
      name: 'size',
      icon: ExpandIcon,
      label: 'Size',
      set: setSize,
      value: selectedSize,
      options: [
        {
          value: 12,
          label: 'Extra small',
        },
        {
          value: 16,
          label: 'Small',
        },
        {
          value: 24,
          label: 'Medium',
        },
        {
          value: 48,
          label: 'Large',
        },
        {
          value: 64,
          label: 'Extra large',
        },
      ]
    },
    {
      name: 'weight',
      icon: ScaleIcon,
      label: 'Weight',
      set: setWeight,
      value: selectedWeight,
      options: [
        {
          value: .5,
          label: 'Light',
        },
        {
          value: 1,
          label: 'Medium',
        },
        {
          value: 2,
          label: 'Regular',
        },
        {
          value: 3,
          label: 'Bold',
        },
      ],
    },
    {
      name: 'color',
      icon: PaletteIcon,
      label: 'Color',
      set: setColor,
      value: selectedColor,
      options: [
        {
          value: 'brand',
          label: 'Default',
        },
        {
          value: 'green',
          label: 'Green',
        },
        {
          value: 'purple',
          label: 'Purple',
        },
        {
          value: 'currentColor',
          label: useColorModeValue('Black', 'White'),
        },
      ],
    },
  ];
  const memoProps = useMemo(() => {
    return {
      selectedIcon,
      setIcon,
      selectedColor,
      setColor,
      selectedWeight,
      setWeight,
      selectedSize,
      setSize,
      selectedProperty,
      setProperty,
    };
  }, [
    selectedIcon,
    setIcon,
    selectedColor,
    setColor,
    selectedWeight,
    setWeight,
    selectedSize,
    setSize,
    selectedProperty,
    setProperty,
  ]);

  const CurrentIcon = icons[memoProps.selectedIcon];

  const getPropertyValueLabel = (property: IconCustomizerProperty<any>) => {
    return property.options.find((option) => option.value === property.value)?.label ?? null;
  }

  return (
    <Stack __css={styles.card} {...rest}>
      <Box __css={styles.iconSelection}>
        {Object.keys(icons).map((iconName) => {
            const Icon = icons[iconName];
            return (
              <Tooltip hasArrow label={iconName} key={`${iconName}`}>
                <IconButton variant="ghost"
                            aria-label={iconName}
                            color={iconName == selectedIcon ? 'brand.500' : 'inherit'}
                            opacity={iconName == selectedIcon ? 1 : .7}
                            _hover={{opacity: 1}}
                            icon={
                              <Icon/>
                            }
                            onClick={() => setIcon(iconName)}
                />
              </Tooltip>)
          }
        )}
      </Box>
      <Box __css={styles.iconPreview}
           color={selectedColor === 'brand' ? 'brand.500' : selectedColor}
      >
        <Flex
          align="center"
          justify="center"
          minW={64 * sizeMultiplier}
          minH={64 * sizeMultiplier}
        >
          <CurrentIcon size={selectedSize * sizeMultiplier}
                       stroke="currentColor"
                       strokeWidth={selectedWeight}
          />
        </Flex>
      </Box>
      <Box __css={styles.propertySelection}>
        {customizationOptions.map((property) => (
          <Menu key={`customize-${property.name}`}>
            <Tooltip hasArrow label={"Select " + property.label.toLowerCase()}>
              <MenuButton
                as={Button}
                variant="ghost"
                color={selectedProperty == property.name ? 'brand.500' : 'inherit'}
                opacity={selectedProperty == property.name ? 1 : .7}
                leftIcon={<property.icon/>}
                onClick={() => setProperty(property.name)}
              >
                <VisuallyHidden>{property.label}</VisuallyHidden>
                {getPropertyValueLabel(property)}
              </MenuButton>
            </Tooltip>
            <MenuList>
              {(property.options).map((option) => (
                <MenuItem onClick={() => property.set(option.value)}
                          value={option.value}
                          key={`customize-${property.name}-${option.value}`}
                          bg={property.value == option.value ? 'brand.500 !important' : 'inherit'}
                          color={property.value == option.value ? 'white !important' : 'inherit'}
                >{option.label}</MenuItem>
              ))}
            </MenuList>
          </Menu>
        ))}
      </Box>
    </Stack>
  );
}

export default IconCustomizerWidget;
