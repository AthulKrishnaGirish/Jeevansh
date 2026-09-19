import { DistrictInfo } from '../types';

export const KERALA_DISTRICTS: DistrictInfo[] = [
  {
    name: 'Kasaragod',
    zone: 'North',
    neighboring: ['Kannur']
  },
  {
    name: 'Kannur',
    zone: 'North',
    neighboring: ['Kasaragod', 'Wayanad', 'Kozhikode']
  },
  {
    name: 'Wayanad',
    zone: 'North',
    neighboring: ['Kannur', 'Kozhikode', 'Malappuram']
  },
  {
    name: 'Kozhikode',
    zone: 'North',
    neighboring: ['Kannur', 'Wayanad', 'Malappuram']
  },
  {
    name: 'Malappuram',
    zone: 'North',
    neighboring: ['Kozhikode', 'Wayanad', 'Palakkad', 'Thrissur']
  },
  {
    name: 'Palakkad',
    zone: 'Central',
    neighboring: ['Malappuram', 'Thrissur']
  },
  {
    name: 'Thrissur',
    zone: 'Central',
    neighboring: ['Malappuram', 'Palakkad', 'Ernakulam', 'Idukki']
  },
  {
    name: 'Ernakulam',
    zone: 'Central',
    neighboring: ['Thrissur', 'Idukki', 'Kottayam', 'Alappuzha']
  },
  {
    name: 'Idukki',
    zone: 'Central',
    neighboring: ['Thrissur', 'Ernakulam', 'Kottayam', 'Pathanamthitta']
  },
  {
    name: 'Kottayam',
    zone: 'South',
    neighboring: ['Ernakulam', 'Idukki', 'Alappuzha', 'Pathanamthitta']
  },
  {
    name: 'Alappuzha',
    zone: 'South',
    neighboring: ['Ernakulam', 'Kottayam', 'Pathanamthitta', 'Kollam']
  },
  {
    name: 'Pathanamthitta',
    zone: 'South',
    neighboring: ['Kottayam', 'Idukki', 'Alappuzha', 'Kollam']
  },
  {
    name: 'Kollam',
    zone: 'South',
    neighboring: ['Alappuzha', 'Pathanamthitta', 'Thiruvananthapuram']
  },
  {
    name: 'Thiruvananthapuram',
    zone: 'South',
    neighboring: ['Kollam']
  }
];

export const DISTRICT_NAMES = KERALA_DISTRICTS.map(d => d.name);

export function getNeighboringDistricts(districtName: string): string[] {
  const found = KERALA_DISTRICTS.find(d => d.name.toLowerCase() === districtName.toLowerCase());
  return found ? found.neighboring : [];
}
