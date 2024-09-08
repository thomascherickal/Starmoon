import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AudioLines, Check, PersonStanding } from "lucide-react";
import React from "react";
import ToyPicker from "../ToyPicker";
import { createClient } from "@/utils/supabase/client";
import { updateUser } from "@/db/users";
import { useToast } from "@/components/ui/use-toast";

const cardData = [
    {
        id: 1,
        title: "Mountain Retreat",
        description: "Peaceful getaway in the mountains",
        imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
        id: 2,
        title: "Beach Paradise",
        description: "Sunny beaches and crystal clear waters",
        imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
        id: 3,
        title: "City Adventure",
        description: "Explore the vibrant city life",
        imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
        id: 4,
        title: "Forest Cabin",
        description: "Cozy cabin surrounded by nature",
        imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
        id: 5,
        title: "Desert Oasis",
        description: "Unique experience in the heart of the desert",
        imageUrl: "/placeholder.svg?height=300&width=400",
    },
    {
        id: 6,
        title: "Tropical Island",
        description: "Paradise found on a remote island",
        imageUrl: "/placeholder.svg?height=300&width=400",
    },
];

interface PickCharacterProps {
    selectedUser: IUser;
    selectedToy: IToy;
    allToys: IToy[];
}

export default function PickCharacter({
    selectedUser,
    selectedToy,
    allToys,
}: PickCharacterProps) {
    const supabase = createClient();
    const { toast } = useToast();

    const pickToy = async (toy: IToy) => {
        // chooseToy(toy);
        await updateUser(
            supabase,
            { toy_id: toy.toy_id },
            selectedUser!.user_id
        );
        toast({
            description: "Your toy has been saved.",
        });
    };

    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);
    const [activeTab, setActiveTab] = React.useState("personality");

    React.useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    return (
        <div className="w-full max-w-7xl mx-auto">
            <h1 className="text-2xl">Pick your character</h1>
            <p className="text-sm text-gray-400">
                Personalize your toy character by selecting a personality and
                voice
            </p>
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="grid w-full sm:w-1/2 grid-cols-2 my-4">
                    <TabsTrigger
                        value="personality"
                        className="flex flex-row items-center gap-1"
                    >
                        <PersonStanding size={18} />
                        Personality
                    </TabsTrigger>
                    <TabsTrigger
                        value="voice"
                        className="flex flex-row items-center gap-1"
                    >
                        <AudioLines size={18} />
                        Voice
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="voice">
                    <ToyPicker
                        allToys={allToys}
                        currentToy={selectedToy}
                        buttonText={"Pick"}
                        imageSize={200}
                        chooseToy={pickToy}
                        showHelpText={false}
                    />
                </TabsContent>
                <TabsContent value="personality">
                    <div className="w-full mx-auto pl-10">
                        <Carousel
                            setApi={setApi}
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-2 md:-ml-4">
                                {cardData.map((card) => (
                                    <CarouselItem
                                        key={card.id}
                                        className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                                    >
                                        <Card className="overflow-hidden rounded-lg">
                                            <div className="h-[400px] relative">
                                                <img
                                                    src={card.imageUrl}
                                                    alt={card.title}
                                                    className="w-full h-2/3 object-cover"
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-white p-4 flex flex-col justify-between">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h3 className="font-semibold text-lg">
                                                                {card.title}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                {
                                                                    card.description
                                                                }
                                                            </p>
                                                        </div>
                                                        <Button
                                                            size="icon"
                                                            className="w-6 h-6 ml-1 flex-shrink-0"
                                                        >
                                                            <Check size={14} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                        <div className="py-2 text-center text-sm text-muted-foreground">
                            Personality {current} of {count}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
