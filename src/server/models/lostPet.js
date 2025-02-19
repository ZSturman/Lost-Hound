/**
 * This file is the model of the LostPet
 * --------------------------------
 * @module domain.LostPet
 */
class LostPet {
    constructor(
        authorName,
        lostPostId,
        timeCreated,
        timeModified,
        isActive,
        authorID,
        petName,
        lastSeenDatetime,
        lastSeenLocation,
        petStatus,
        species,
        age,
        breed,
        primaryColour,
        secondaryColour,
        size,
        state,
        additionalDetails,
        photo
    ) {
        // The name of the author who created the post
        this.authorName = authorName;

        // The unique identifier of the post
        this.lostPostId = lostPostId;

        // The timestamp when the post was created
        this.timeCreated = timeCreated;

        // The timestamp when the post was last modified
        this.timeModified = timeModified;

        // Indicates if the post is still active (true for active, false for inactive)
        this.isActive = isActive;

        // The unique identifier of the author who created the post
        this.authorID = authorID;

        // The name of the lost pet
        this.petName = petName;

        // The datetime when the pet was last seen
        this.lastSeenDatetime = lastSeenDatetime;

        // The location where the pet was last seen
        this.lastSeenLocation = lastSeenLocation;

        // The current status of the pet (e.g., lost, found)
        this.status = petStatus;

        // The species of the pet (e.g., dog, cat)
        this.species = species;

        // The age of the pet
        this.age = age;

        // The breed of the pet
        this.breed = breed;

        // The primary color of the pet's fur or skin
        this.primaryColour = primaryColour;

        // The secondary color of the pet's fur or skin (if any)
        this.secondaryColour = secondaryColour;

        // The size of the pet (e.g., small, medium, large)
        this.size = size;

        // The state or region where the pet was lost
        this.state = state;

        // Any additional details about the lost pet
        this.additionalDetails = additionalDetails;

        // A photo of the lost pet
        this.photo = photo;
    }
}

export default LostPet;