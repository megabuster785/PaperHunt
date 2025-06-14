export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center py-4 text-sm text-gray-500">
      © {new Date().getFullYear()} PaperHunt. All rights reserved.
    </footer>
  );
}