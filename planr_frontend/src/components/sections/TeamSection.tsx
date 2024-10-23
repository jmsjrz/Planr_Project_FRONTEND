import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TeamSection() {
  const teamMembers = [
    {
      name: "James JAROSZ",
      role: "Fondateur & CEO",
      image: "/placeholder.svg",
    },
    {
      name: "James JAROSZ",
      role: "CTO",
      image: "/placeholder.svg",
    },
    {
      name: "James JAROSZ",
      role: "Designer UX",
      image: "/placeholder.svg",
    },
    {
      name: "James JAROSZ",
      role: "Lead Developer",
      image: "/placeholder.svg",
    },
  ];

  return (
    <section className="py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        L'équipe derrière Planr
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, index) => (
          <Card key={index}>
            <CardHeader>
              <img
                src={member.image}
                alt={member.name}
                className="rounded-full w-32 h-32 mx-auto mb-4"
              />
              <CardTitle>{member.name}</CardTitle>
              <CardDescription>{member.role}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
