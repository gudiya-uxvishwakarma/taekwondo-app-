import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';

/**
 * Universal Icon component using react-native-vector-icons
 * Supports multiple icon families for comprehensive icon coverage
 * 
 * @param {string} name - Icon name
 * @param {number} size - Icon size (default: 24)
 * @param {string} color - Icon color (default: '#000')
 * @param {string} type - Icon family type (default: 'MaterialIcons')
 * @param {object} style - Additional styles
 */
const Icon = ({ 
  name, 
  size = 24, 
  color = '#000', 
  type = 'MaterialIcons',
  style,
  ...props 
}) => {
  const IconComponent = {
    MaterialIcons,
    MaterialCommunityIcons,
    Ionicons,
    FontAwesome,
    FontAwesome5,
    AntDesign,
    Feather,
    Entypo,
  }[type];

  if (!IconComponent) {
    console.warn(`Icon type "${type}" not found. Using MaterialIcons as fallback.`);
    return <MaterialIcons name={name} size={size} color={color} style={style} {...props} />;
  }

  return <IconComponent name={name} size={size} color={color} style={style} {...props} />;
};

export default Icon;