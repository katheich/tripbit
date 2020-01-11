from rest_framework import serializers
from django.contrib.auth import get_user_model
User = get_user_model()
import django.contrib.auth.password_validation as validations
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError

class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True) 

    def validate(self, data):

        password = data.pop('password')
        password_confirmation = data.pop('password_confirmation')

        if password != password_confirmation:
            raise serializers.ValidationError({'password_confirmation': 'Passwords do not match'})

        try:
            validations.validate_password(password=password)
        except ValidationError as err:
            raise serializers.ValidationError({'password': err.messages})

        data['password'] = make_password(password)
        return data

        # input the required fields in the serializer. The serializer is used for the fields requested on the route.

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password', 'password_confirmation')

# class UserListSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = User
#         fields = ('id', 'username', 'first name', 'last name', 'score', 'image')

class PopulatedUserSerializer(serializers.ModelSerializer):

  # groups requested needs to be sorted

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'score', 'image', 'towns', 'trips', 'badges', 'groups_owned', 'groups_joined', 'groups_podium1', 'groups_podium2', 'groups_podium3')

