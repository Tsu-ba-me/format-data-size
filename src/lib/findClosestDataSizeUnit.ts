import { ConversionTable, DataSizeUnit, DataSizeUnitSection } from '../types';

export const findClosestDataSizeUnit = (
  valueInBits: bigint,
  fromUnit: DataSizeUnit,
  toUnitSection: DataSizeUnitSection,
  conversionTable: Readonly<ConversionTable>,
  units: Readonly<DataSizeUnit[]>,
  unitSections: Readonly<DataSizeUnitSection[]>,
  unitSectionLength: Readonly<number>,
) => {
  let toUnitSectionIndex = unitSections.indexOf(toUnitSection);
  let newToUnit = fromUnit;

  if (toUnitSectionIndex < 0) {
    const isBinary = fromUnit[1] === 'i';
    const isByte = /B$/.test(fromUnit);

    toUnitSectionIndex = unitSections.findIndex(
      (section) =>
        section === `${isBinary ? 'i' : ''}${isByte ? 'byte' : 'bit'}`,
    );
  }

  let searchIndex = toUnitSectionIndex * unitSectionLength;
  const searchMax = searchIndex + unitSectionLength;

  for (; searchIndex < searchMax; searchIndex += 1) {
    const searchUnit = units[searchIndex];
    const searchConvertKey = `b-${searchUnit}`;

    if (valueInBits >= conversionTable[searchConvertKey]) {
      newToUnit = searchUnit;
    } else {
      searchIndex = searchMax;
    }
  }

  return newToUnit;
};
