#!/usr/bin/env tsx

/**
 * Test script for marketplace discovery validation
 * Tests the validation logic without making actual API calls
 */

import * as fs from 'fs/promises';
import * as path from 'path';

// Mock manifest validation
async function validateManifest(manifestData: any): Promise<{ valid: boolean; error?: string }> {
  try {
    // Basic validation
    if (!manifestData.name) {
      return { valid: false, error: 'Missing required field: name' };
    }

    if (!Array.isArray(manifestData.plugins)) {
      return { valid: false, error: 'Missing or invalid plugins array' };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Test the validation logic
async function runTests() {
  console.log('🧪 Testing marketplace discovery validation logic\n');

  const tests = [
    {
      name: 'Valid manifest',
      data: {
        name: 'test-marketplace',
        plugins: [{ name: 'test-plugin' }],
      },
      expectedValid: true,
    },
    {
      name: 'Missing name field',
      data: {
        plugins: [{ name: 'test-plugin' }],
      },
      expectedValid: false,
    },
    {
      name: 'Missing plugins array',
      data: {
        name: 'test-marketplace',
      },
      expectedValid: false,
    },
    {
      name: 'Invalid plugins (not array)',
      data: {
        name: 'test-marketplace',
        plugins: 'not-an-array',
      },
      expectedValid: false,
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await validateManifest(test.data);
    const success = result.valid === test.expectedValid;

    if (success) {
      console.log(`✅ ${test.name}`);
      passed++;
    } else {
      console.log(`❌ ${test.name}`);
      console.log(`   Expected: ${test.expectedValid}, Got: ${result.valid}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      failed++;
    }
  }

  console.log(`\n📊 Test Results:`);
  console.log(`   Passed: ${passed}/${tests.length}`);
  console.log(`   Failed: ${failed}/${tests.length}`);

  if (failed > 0) {
    process.exit(1);
  }

  // Test loading existing marketplaces
  console.log('\n📦 Testing marketplace data loading...');
  try {
    const data = await fs.readFile(
      path.join(process.cwd(), '.claude-plugin', 'marketplaces.json'),
      'utf-8'
    );
    const parsed = JSON.parse(data);
    console.log(`✅ Successfully loaded ${parsed.marketplaces.length} existing marketplaces`);

    // Validate structure
    if (!parsed.hub || !parsed.marketplaces) {
      console.log('❌ Invalid marketplace data structure');
      process.exit(1);
    }

    // Check for required fields in first marketplace
    if (parsed.marketplaces.length > 0) {
      const first = parsed.marketplaces[0];
      const requiredFields = ['id', 'name', 'repository', 'manifestUrl'];
      const missing = requiredFields.filter(field => !first[field]);

      if (missing.length > 0) {
        console.log(`❌ Missing required fields: ${missing.join(', ')}`);
        process.exit(1);
      }

      console.log('✅ Marketplace structure is valid');
    }
  } catch (error) {
    console.log('❌ Failed to load marketplaces.json:', error);
    process.exit(1);
  }

  console.log('\n✨ All tests passed!');
}

runTests();
