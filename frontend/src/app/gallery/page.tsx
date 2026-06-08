import { redirect } from 'next/navigation';

// The gallery has been replaced by the Products section.
export default function GalleryRedirect() {
  redirect('/products');
}
