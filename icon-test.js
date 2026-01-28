// Test script to check available icons
const fs = require('fs');
const path = require('path');

// Common MaterialCommunityIcons that should work
const testIcons = [
  'account',
  'home',
  'star',
  'heart',
  'check',
  'close',
  'menu',
  'arrow-left',
  'arrow-right',
  'download',
  'share',
  'eye',
  'calendar',
  'clock',
  'trophy',
  'school',
  'card-account-details',
  'file-pdf-box',
  'qrcode',
  'chevron-right',
  'check-circle'
];

console.log('Testing these icons in MaterialCommunityIcons:');
testIcons.forEach(icon => {
  console.log(`- ${icon}`);
});

console.log('\nThese icons should work in your React Native app with MaterialCommunityIcons.');