#!/bin/bash
# HorizonCare AI — YOLO Build Verification Script
# Run from the project root before every deploy.
# All checks must pass. Any failure = hard stop.

set -e

ERRORS=0

echo "🔍 Running YOLO build verification..."

# 1. TypeScript check
echo "  [1/5] TypeScript (tsc --noEmit)..."
if ! npx tsc --noEmit 2>&1; then
  echo "  ❌ TypeScript errors found"
  ERRORS=$((ERRORS+1))
else
  echo "  ✅ TypeScript clean"
fi

# 2. File length check — no file over 150 lines
echo "  [2/5] File length (max 150 lines)..."
LONG_FILES=$(find . -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.vercel/*" \( -name "*.ts" -o -name "*.tsx" \) | xargs wc -l 2>/dev/null | awk '$1 > 150 && $2 != "total"' | grep -v "^$" || true)
if [ -n "$LONG_FILES" ]; then
  echo "  ❌ Files exceeding 150 lines:"
  echo "$LONG_FILES"
  ERRORS=$((ERRORS+1))
else
  echo "  ✅ All files under 150 lines"
fi

# 3. README check
echo "  [3/5] README.md exists..."
if [ ! -f "README.md" ]; then
  echo "  ❌ README.md missing"
  ERRORS=$((ERRORS+1))
else
  echo "  ✅ README.md present"
fi

# 4. Types file check
echo "  [4/5] lib/types.ts exists..."
if [ ! -f "lib/types.ts" ]; then
  echo "  ❌ lib/types.ts missing — schema must be documented"
  ERRORS=$((ERRORS+1))
else
  echo "  ✅ lib/types.ts present"
fi

# 5. No TODO/placeholder check
echo "  [5/5] No TODO or placeholder text..."
TODO_FILES=$(grep -rl "TODO\|FIXME\|PLACEHOLDER\|\[INSERT\]" --include="*.ts" --include="*.tsx" . --exclude-dir=node_modules --exclude-dir=.next 2>/dev/null || true)
if [ -n "$TODO_FILES" ]; then
  echo "  ❌ TODO/placeholder text found in:"
  echo "$TODO_FILES"
  ERRORS=$((ERRORS+1))
else
  echo "  ✅ No TODOs or placeholders"
fi

echo ""
if [ $ERRORS -eq 0 ]; then
  echo "✅ All checks passed. Ready to deploy."
  exit 0
else
  echo "❌ $ERRORS check(s) failed. Fix before deploying."
  exit 1
fi
