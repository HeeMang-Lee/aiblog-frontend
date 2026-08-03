import { getCategories } from '@/lib/notion';
import HeaderNav from './HeaderNav';

/**
 * Server component so every page gets the category list without each one
 * fetching it. The interactive parts live in HeaderNav.
 */
export default async function Header() {
  const categories = await getCategories();
  return <HeaderNav categories={categories} />;
}
