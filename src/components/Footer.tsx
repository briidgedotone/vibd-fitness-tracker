export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 text-gray-600 py-4 text-center text-sm">
      <div className="container mx-auto px-4">
        <p>© {currentYear} Fitness Tracker. All rights reserved.</p>
      </div>
    </footer>
  );
}